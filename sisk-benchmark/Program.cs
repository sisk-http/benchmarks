using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Columns;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Diagnosers;
using BenchmarkDotNet.Jobs;
using BenchmarkDotNet.Loggers;
using BenchmarkDotNet.Running;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace sisk_benchmark;

public static class Program
{
    private static void Main()
    {
        BenchmarkRunner.Run<Test1>(new Config());
        Console.ReadKey();
    }

    private static void RunRace(string label, Func<Task> action)
    {
        double max = TimeSpan.FromSeconds(10).TotalMilliseconds;
        int count = 0;
        Stopwatch sw = new Stopwatch();
        sw.Start();
        var raceTask = Task.Run(async () =>
        {
            while (sw.ElapsedMilliseconds < max)
            {
                await action();
                count++;
            }
        });
        raceTask.Wait();
        Console.WriteLine($"Race \"{label}\" result in 10 seconds: {count} iterations");
    }
}

class Config : ManualConfig
{
    public Config()
    {
        AddLogger(new ConsoleLogger());
        AddColumn(new TagColumn("Framework", name => name));
        AddColumn(StatisticColumn.Mean);
        AddColumn(StatisticColumn.StdDev);
        AddColumn(StatisticColumn.StdErr);
        AddColumn(StatisticColumn.OperationsPerSecond);
        AddDiagnoser(MemoryDiagnoser.Default);
    }
}

public class Test1
{
    private HttpClient? _httpClient;

    [GlobalSetup]
    public void Setup() => _httpClient = new HttpClient();

    [Benchmark]
    public async Task AspNetMinimal() => await _httpClient!.GetStringAsync("http://localhost:5000/");

    [Benchmark]
    public async Task SiskDotNet() => await _httpClient!.GetStringAsync("http://localhost:5222/");
}