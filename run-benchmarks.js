'use strict';

const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { spawn } = require('child_process');
const { setTimeout: sleep } = require('timers/promises');

if (typeof fetch !== 'function') {
    console.error('Global fetch API not available. Please run with Node.js 18 or newer.');
    process.exit(1);
}

const workspaceRoot = __dirname;
const runningServers = new Set();
let shuttingDown = false;

function composeUrl(port, suffix) {
    const pathSuffix = suffix && suffix.length ? suffix : '/';
    const normalized = pathSuffix.startsWith('/') ? pathSuffix : `/${pathSuffix}`;
    return `http://localhost:${port}${normalized}`;
}

async function runCommand(command, args, options = {}, label) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit',
            ...options,
        });

        child.once('error', reject);
        child.once('exit', (code, signal) => {
            if (code === 0) {
                resolve();
                return;
            }
            const reason = signal ? `terminated by ${signal}` : `exited with code ${code}`;
            reject(new Error(`${label || command} ${reason}`));
        });
    });
}

async function startServer({ name, command, args, cwd, env }) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            env: { ...process.env, ...env },
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let settled = false;

        const handleError = (error) => {
            if (!settled) {
                settled = true;
                reject(error);
            } else {
                console.error(`[${name}] process error: ${error.message}`);
            }
        };

        child.once('error', handleError);

        child.stdout.on('data', (chunk) => {
            process.stdout.write(`[${name}] ${chunk}`);
        });

        child.stderr.on('data', (chunk) => {
            process.stderr.write(`[${name}] ${chunk}`);
        });

        child.once('spawn', () => {
            if (!settled) {
                settled = true;
                runningServers.add(child);
                resolve(child);
            }
        });
    });
}

async function stopProcess(child, signal = 'SIGTERM', timeoutMs = 4000) {
    if (!child) {
        return;
    }

    if (child.exitCode !== null || child.signalCode !== null) {
        runningServers.delete(child);
        return;
    }

    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            if (child.exitCode === null && child.signalCode === null) {
                child.kill('SIGKILL');
            }
        }, timeoutMs).unref();

        child.once('exit', () => {
            clearTimeout(timer);
            runningServers.delete(child);
            resolve();
        });

        child.kill(signal);
    });
}

async function waitForServer({ url, timeoutMs, pollIntervalMs, server, name }) {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        if (server.exitCode !== null || server.signalCode !== null) {
            throw new Error(`${name} stopped unexpectedly while waiting for readiness`);
        }

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 1500).unref();
            const response = await fetch(url, { method: 'GET', signal: controller.signal });
            clearTimeout(timeout);

            if (response.ok || response.status < 500) {
                return;
            }
        } catch (error) {
            // Ignore and retry while the timeout has not elapsed.
        }

        await sleep(pollIntervalMs);
    }

    throw new Error(`Timed out waiting for ${name} at ${url}`);
}

async function runBenchmark({ name, bombardierExecutable, targetUrl, connections, outputPath, duration }) {
    return new Promise((resolve, reject) => {
        const args = [`--format=json`, `--fasthttp`, `--connections=${connections}`, `--duration=${duration}s`];
        args.push(targetUrl);

        const child = spawn(bombardierExecutable, args, {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr.on('data', (chunk) => {
            const text = chunk.toString();
            stderr += text;
            process.stderr.write(text);
        });

        child.once('error', reject);
        child.once('exit', async (code, signal) => {

            await sleep(100);

            if (code === 0) {
                try {
                    // Extract JSON from output (bombardier may print progress before JSON)
                    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
                    const jsonOutput = jsonMatch ? jsonMatch[0] : stdout;

                    if (outputPath) {
                        await fs.writeFile(outputPath, jsonOutput, 'utf8');
                    }

                    resolve(jsonOutput);
                } catch (error) {
                    reject(error);
                }
                return;
            }
            const reason = signal ? `terminated by ${signal}` : `exited with code ${code}`;
            reject(new Error(`${name} benchmark ${reason}`));
        });
    });
}

async function parseBombardierJson(jsonOutput) {
    const data = JSON.parse(jsonOutput);
    const result = data.result;
    const latency = result.latency;
    const rps = result.rps;

    // Convert microseconds to milliseconds
    const avgMs = latency.mean / 1000;
    const maxMs = latency.max / 1000;

    const totalRequests = result.req1xx + result.req2xx + result.req3xx + result.req4xx + result.req5xx + result.others;
    const failedRequests = result.req4xx + result.req5xx + result.others;
    const failureRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;

    return {
        requests: totalRequests,
        requestsPerSecond: rps.mean,
        avgMs,
        p50Ms: rps.percentiles?.['50'] || 0,
        p75Ms: rps.percentiles?.['75'] || 0,
        p90Ms: rps.percentiles?.['90'] || 0,
        p95Ms: rps.percentiles?.['95'] || 0,
        p99Ms: rps.percentiles?.['99'] || 0,
        maxMs,
        failureRate,
        rawData: data,
    };
}

async function getCommandStdout(command, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        child.once('error', reject);
        child.once('exit', (code) => {
            if (code === 0) {
                resolve(stdout.trim());
                return;
            }

            const reason = stderr ? `${stderr.trim()}` : `exit code ${code}`;
            reject(new Error(`${command} ${args.join(' ')} failed: ${reason}`));
        });
    });
}

async function tryGetCommandVersion(command, args) {
    try {
        const output = await getCommandStdout(command, args);
        const firstLine = output.split(/\r?\n/).find((line) => line.trim().length);
        return firstLine || output;
    } catch (error) {
        console.warn(`Unable to retrieve version for ${command}: ${error.message}`);
        return null;
    }
}

async function collectEnvironmentInfo(config) {
    const cpus = os.cpus();
    const cpuModelRaw = cpus && cpus.length ? cpus[0].model : null;
    const cpuModel = (cpuModelRaw || 'Unknown CPU').trim();
    const osInfo = `${os.type()} ${os.release()} (${os.platform()})`;
    const architecture = process.arch;
    const totalMemoryGb = os.totalmem() / (1024 ** 3);
    const dotnetExecutable = config.dotnetExecutable || 'dotnet';
    const bombardierExecutable = config.bombardierExecutable || 'bombardier';

    const dotnetVersion = await tryGetCommandVersion(dotnetExecutable, ['--version']);
    const bombardierVersion = await tryGetCommandVersion(bombardierExecutable, ['--version']);

    return {
        cpu: cpuModel,
        os: osInfo,
        architecture,
        ram: `${totalMemoryGb.toFixed(2)} GB`,
        dotnet: dotnetVersion ? `${dotnetExecutable} ${dotnetVersion}` : `${dotnetExecutable} (version unknown)`,
        bombardier: bombardierVersion ? `${bombardierExecutable} ${bombardierVersion}` : `${bombardierExecutable} (version unknown)`,
    };
}

function formatNumber(value, digits = 2) {
    const fixed = Number(value).toFixed(digits);
    const [integer, decimal] = fixed.split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decimal !== undefined ? `${formattedInteger},${decimal}` : formattedInteger;
}

function sortConnectionLevels(connectionLevels) {
    return connectionLevels.sort((a, b) => {
        const isNumberA = typeof a === 'number';
        const isNumberB = typeof b === 'number';

        if (isNumberA && isNumberB) {
            return a - b;
        }

        if (isNumberA) {
            return -1;
        }

        if (isNumberB) {
            return 1;
        }

        return String(a).localeCompare(String(b));
    });
}

function buildDetailedMarkdown(entries, generatedAt, title = 'Benchmark Report', insights = null, environmentInfo = null) {
    const lines = [];
    const successes = entries.filter((entry) => entry.type === 'success');
    const failures = entries.filter((entry) => entry.type === 'error');

    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`Generated at ${generatedAt.toISOString()}`);
    lines.push('');

    if (environmentInfo) {
        lines.push('## Environment');
        lines.push('');
        lines.push(`- **Processor:** ${environmentInfo.cpu}`);
        lines.push(`- **Operating system:** ${environmentInfo.os}`);
        lines.push(`- **Architecture:** ${environmentInfo.architecture}`);
        lines.push(`- **RAM:** ${environmentInfo.ram}`);
        lines.push(`- **.NET executable:** ${environmentInfo.dotnet}`);
        lines.push(`- **Bombardier:** ${environmentInfo.bombardier}`);
        lines.push('');
    }

    if (insights) {
        lines.push('## AI generated insights');
        lines.push('');
        lines.push(insights);
        lines.push('');
    }

    if (successes.length) {
        // Group by project
        const projectMap = new Map();
        for (const entry of successes) {
            const projectName = entry.project.name;
            if (!projectMap.has(projectName)) {
                projectMap.set(projectName, []);
            }
            projectMap.get(projectName).push(entry);
        }

        // Determine baseline (first project alphabetically or explicitly configured)
        const projectNames = Array.from(projectMap.keys()).sort();
        const baselineName = projectNames[0];

        // Calculate best (highest) requests/s for each connection level to compute ratios
        const bestRpsByConnections = new Map();
        const connectionLevelsSet = new Set();
        for (const projectName of projectNames) {
            const projectEntries = projectMap.get(projectName);
            for (const entry of projectEntries) {
                const metrics = entry.allMetrics || [entry.metrics];
                for (const m of metrics) {
                    const connections = m.connections ?? 'N/A';
                    connectionLevelsSet.add(connections);
                    const current = bestRpsByConnections.get(connections) || 0;
                    if (m.requestsPerSecond > current) {
                        bestRpsByConnections.set(connections, m.requestsPerSecond);
                    }
                }
            }
        }

        lines.push('## Summary');
        lines.push('');
        const connectionLevels = sortConnectionLevels(Array.from(connectionLevelsSet));

        for (const connection of connectionLevels) {
            const label = connection === 'N/A' ? 'Default' : `${connection}`;
            lines.push(`### ${label} connections`);
            lines.push('');
            lines.push('| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |');
            lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');

            let rowsAdded = 0;

            for (const projectName of projectNames) {
                const projectEntries = projectMap.get(projectName);
                const isBaseline = projectName === baselineName;

                for (const entry of projectEntries) {
                    const metrics = entry.allMetrics || [entry.metrics];

                    for (const m of metrics) {
                        const metricConnection = m.connections ?? 'N/A';
                        if (metricConnection !== connection) {
                            continue;
                        }

                        const baseline = isBaseline ? ' ✓' : '';
                        const bestRps = bestRpsByConnections.get(connection) || m.requestsPerSecond;
                        const ratioValue = bestRps > 0 ? (m.requestsPerSecond / bestRps) : 0;
                        const ratio = ratioValue.toFixed(2);

                        lines.push(
                            `| ${projectName}${baseline} | ${formatNumber(m.requestsPerSecond, 2)} | ${ratio} | ${formatNumber(m.avgMs, 3)} | ${formatNumber(m.p50Ms, 0)} | ${formatNumber(m.p75Ms, 0)} | ${formatNumber(m.p90Ms, 0)} | ${formatNumber(m.p95Ms, 0)} | ${formatNumber(m.p99Ms, 0)} | ${formatNumber(m.maxMs, 3)} | ${formatNumber(m.requests, 0)} |`
                        );
                        rowsAdded += 1;
                    }
                }
            }

            lines.push('');
        }

        lines.push('## Detailed Metrics by Project');
        lines.push('');

        for (const projectName of projectNames) {
            const projectEntries = projectMap.get(projectName);
            lines.push(`---\n### ${projectName}`);
            lines.push('');

            for (const entry of projectEntries) {
                const metrics = entry.allMetrics || [entry.metrics];

                for (const m of metrics) {
                    lines.push(`**${m.connections || 'Default'} Connections:**`);
                    lines.push('');
                    lines.push(`- **Requests per second:** ${formatNumber(m.requestsPerSecond, 2)}`);
                    lines.push(`- **Average latency:** ${formatNumber(m.avgMs, 3)} ms`);
                    lines.push(`- **Max latency:** ${formatNumber(m.maxMs, 3)} ms`);
                    lines.push(`- **Total requests:** ${formatNumber(m.requests, 0)}`);
                    lines.push(`- **Failure rate:** ${formatNumber(m.failureRate, 2)}%`);
                    lines.push('');
                }
            }
        }
    }

    if (failures.length) {
        lines.push('## Failures');
        lines.push('');
        for (const { project, stage, error } of failures) {
            lines.push(`- **${project.name}** (${stage}) – ${error.message}`);
        }
    }

    return lines.join('\n');
}

async function main() {
    const configPath = path.resolve(workspaceRoot, 'benchmark.config.json');
    const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
    const generatedAt = new Date();
    const environmentInfo = await collectEnvironmentInfo(config);
    const entries = [];

    const resultsDir = path.resolve(workspaceRoot, config.resultsDir || 'benchmark-results');
    await fs.mkdir(resultsDir, { recursive: true });

    for (const project of config.projects) {
        const projectDir = path.resolve(workspaceRoot, project.path);
        const buildConfiguration = project.buildConfiguration || 'Release';
        const name = project.name;
        const summaryPath = path.join(resultsDir, `${name}-summary.json`);

        console.log(`\n=== ${name}: build ===`);

        try {
            await runCommand(
                config.dotnetExecutable || 'dotnet',
                ['build', '-c', buildConfiguration],
                { cwd: projectDir },
                `${name} build`,
            );
        } catch (error) {
            entries.push({ type: 'error', project, stage: 'build', error });
            console.error(`${name} build failed: ${error.message}`);
            continue;
        }

        console.log(`=== ${name}: start ===`);

        let server;
        try {
            server = await startServer({
                name,
                command: config.dotnetExecutable || 'dotnet',
                args: ['run', '--no-build', '--configuration', buildConfiguration, ...(project.runArgs || [])],
                cwd: projectDir,
                env: project.env || {},
            });
        } catch (error) {
            entries.push({ type: 'error', project, stage: 'start', error });
            console.error(`${name} failed to start: ${error.message}`);
            continue;
        }

        try {
            const healthUrl = project.healthCheckUrl || composeUrl(project.port, project.healthPath);
            await waitForServer({
                url: healthUrl,
                timeoutMs: project.readyTimeoutMs || 20000,
                pollIntervalMs: project.pollIntervalMs || 500,
                server,
                name,
            });

            const targetUrl = project.benchmark?.targetUrl || composeUrl(project.port, project.benchmarkPath || project.healthPath || '/');
            const connectionLevels = config.benchmark.connectionLevels;
            const allMetrics = [];

            for (const connections of connectionLevels) {
                console.log(`=== ${name}: warmup with ${connections} connections ===`);

                // Warmup phase - 5 seconds
                await runBenchmark({
                    name,
                    bombardierExecutable: config.bombardierExecutable || 'bombardier',
                    targetUrl,
                    connections,
                    outputPath: null,
                    duration: config.benchmark.warmupDuration
                });

                console.log(`=== ${name}: benchmark with ${connections} connections ===`);

                const outputPath = path.join(resultsDir, `test-${name}-${connections}.json`);

                const output = await runBenchmark({
                    name,
                    bombardierExecutable: config.bombardierExecutable || 'bombardier',
                    targetUrl,
                    connections,
                    outputPath,
                    duration: config.benchmark.benchmarkDuration
                });

                const metrics = await parseBombardierJson(output);
                allMetrics.push({ connections, ...metrics });
            }

            // Use the metrics from the 100 connections test as the main result
            const mainMetrics = allMetrics.find(m => m.connections === 100) || allMetrics[0];
            entries.push({ type: 'success', project, metrics: mainMetrics, allMetrics, summaryPath });
            console.log(`=== ${name}: benchmark complete ===`);
        } catch (error) {
            entries.push({ type: 'error', project, stage: 'benchmark', error });
            console.error(`${name} benchmark failed: ${error.message}`);
        } finally {
            await stopProcess(server, 'SIGTERM', project.stopTimeoutMs || 4000);
        }
    }

    const timestamp = generatedAt.toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
    const reportPath = path.resolve(
        workspaceRoot,
        config.reportPath || path.join(config.resultsDir || 'benchmark-results', `benchmark-report-${timestamp}.md`),
    );

    await fs.mkdir(path.dirname(reportPath), { recursive: true });

    // Generate initial markdown without insights
    const initialMarkdown = buildDetailedMarkdown(entries, generatedAt, config.reportTitle || 'Benchmark Report', null, environmentInfo);

    // Try to get insights from API
    let insights = null;
    const apiKey = process.env.AIVAX_API_KEY;

    if (apiKey) {
        try {
            console.log('\nFetching insights from AI...');
            const response = await fetch('https://inference.aivax.net/api/v1/functions/hosted/019a5f3d-6452-731b-ba6c-2bbb07569ff3/benchmark-summary', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'text/plain',
                },
                body: initialMarkdown,
            });

            if (response.ok) {
                insights = await response.text();
                console.log('Insights received successfully');
            } else {
                console.warn(`Failed to fetch insights: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.warn(`Error fetching insights: ${error.message}`);
        }
    } else {
        console.log('\nSkipping insights generation (AIVAX_API_KEY not set)');
    }

    // Generate final markdown with insights
    const markdown = buildDetailedMarkdown(entries, generatedAt, config.reportTitle || 'Benchmark Report', insights, environmentInfo);
    await fs.writeFile(reportPath, `${markdown}\n`, 'utf8');

    console.log(`\nReport written to ${path.relative(workspaceRoot, reportPath)}`);
}

function handleShutdown(signal) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;
    console.log(`\nReceived ${signal}, shutting down running servers...`);

    const tasks = Array.from(runningServers).map((proc) => stopProcess(proc).catch(() => { }));

    Promise.all(tasks)
        .catch(() => { })
        .finally(() => {
            process.exit(1);
        });
}

process.once('SIGINT', () => handleShutdown('SIGINT'));
process.once('SIGTERM', () => handleShutdown('SIGTERM'));

main().catch((error) => {
    console.error(error);
    handleShutdown('error');
});
