# Benchmark Report

Generated at 2025-11-17T16:55:43.321Z

## Environment

- **Processor:** 11th Gen Intel(R) Core(TM) i5-11400F @ 2.60GHz
- **Operating system:** Windows_NT 10.0.19044 (win32)
- **Architecture:** x64
- **RAM:** 31.86 GB
- **.NET executable:** dotnet 10.0.100
- **Bombardier:** bombardier (version unknown)

## AI generated insights

### Key Points

- **Benchmark Setup**: Tests conducted on an 11th Gen Intel i5-11400F (2.60GHz), Windows 10 (x64), 31.86 GB RAM, using .NET 10.0.100 and Bombardier for load generation. Scenarios vary by concurrent connections: 10, 100, 500, and 1000. Metrics include requests per second (RPS), average latency, percentiles (p50-p99 RPS), max latency, total requests, and failure rate. ASP.NET Minimal serves as the baseline (ratio 1.00).

- **Overall Performance Ranking (Avg RPS Across Scenarios)**:
  - ASP.NET Minimal: Highest RPS in all scenarios, peaking at 236.5 RPS (100 connections), but drops to 190.5 RPS at 1000 connections.
  - Cadente: Strong at low load (107 RPS at 10 connections), peaks at 167.2 RPS (100 connections), but declines to 142.5 RPS at high load.
  - Sisk (Cadente): Comparable to Cadente standalone, outperforms at 500 connections (160.8 RPS vs. Cadente's 152 RPS), but shows high max latency (519.7 ms at 1000 connections).
  - HttpListener: Lowest at low load (82.8 RPS at 10 connections), stable at high load (137.2 RPS at 1000 connections), with consistent low max latency.
  - Sisk (HttpListener): Similar to standalone HttpListener, slightly better at high load (143.5 RPS at 1000 connections), but underperforms at low load (78.1 RPS at 10 connections).

- **Latency Trends**:
  - All projects exhibit low average latency (<0.2 ms) at 10 connections, increasing with load (up to ~7 ms at 1000 connections).
  - Max latency spikes notably for Cadente-based setups (e.g., 519.7 ms for Sisk-Cadente at 1000 connections), while HttpListener variants remain under 45 ms across all loads.
  - ASP.NET Minimal balances low average latency (5.2 ms at 1000 connections) with moderate max (185.4 ms).

- **Failure Rates**: Near-zero (0.00-0.02%) for most at low/medium loads. Minor increases at 1000 connections for ASP.NET Minimal (0.02%), Cadente (0.11%), and Sisk-Cadente (0.19%); HttpListener variants show 0.00%.

### Insights

- **Scalability Behavior**: Performance peaks around 100 connections for most (ASP.NET and Cadente >200/167 RPS), then degrades at higher concurrency due to contention, with ASP.NET Minimal retaining the lead (ratios 0.58-0.85 for others). HttpListener provides stable throughput at scale but sacrifices low-load speed.
- **Trade-offs by Backend**: Cadente excels in low-latency, high-throughput at moderate loads but suffers from outlier latencies and higher failures under extreme concurrency. HttpListener prioritizes reliability (low max latency, zero failures) at the cost of raw RPS, especially at low connections.
- **Sisk Integration Effects**: Using Cadente in Sisk boosts mid-load performance (e.g., +8% RPS at 500 connections) but amplifies latency variance; HttpListener in Sisk yields more consistent results without gains in peak RPS.
- **General Observations**: No project dominates all metrics; choice depends on use case (e.g., low-load speed vs. high-concurrency stability). All maintain sub-1% failure rates, indicating robust handling of the tested workloads on this hardware. Results are hardware-specific and may vary with optimizations or different environments.

## Summary

### 10 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 125.260,93 | 1.00 | 0,077 | 127.302 | 130.400 | 132.302 | 133.695 | 151.804 | 12,999 | 1.252.683 |
| Cadente | 107.006,71 | 0.85 | 0,092 | 107.588 | 108.399 | 109.213 | 109.796 | 115.147 | 14,999 | 1.070.021 |
| HttpListener | 82.801,37 | 0.66 | 0,119 | 83.247 | 84.096 | 84.689 | 85.093 | 91.590 | 9,390 | 828.059 |
| Sisk (Cadente) | 102.954,73 | 0.82 | 0,095 | 103.435 | 105.098 | 106.453 | 106.992 | 115.162 | 12,999 | 1.029.621 |
| Sisk (HttpListener) | 78.109,87 | 0.62 | 0,126 | 78.687 | 79.754 | 80.393 | 80.790 | 86.358 | 9,379 | 781.176 |

### 100 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 236.514,91 | 1.00 | 0,420 | 240.163 | 249.007 | 255.021 | 256.395 | 258.956 | 19,778 | 2.365.140 |
| Cadente | 167.171,40 | 0.71 | 0,596 | 168.806 | 170.938 | 173.058 | 174.592 | 178.914 | 23,617 | 1.671.616 |
| HttpListener | 144.100,16 | 0.61 | 0,692 | 144.853 | 147.248 | 149.606 | 151.049 | 153.446 | 13,492 | 1.440.965 |
| Sisk (Cadente) | 142.861,61 | 0.60 | 0,697 | 144.305 | 148.425 | 152.412 | 154.147 | 160.194 | 20,516 | 1.428.759 |
| Sisk (HttpListener) | 136.954,20 | 0.58 | 0,728 | 138.093 | 141.782 | 143.014 | 144.153 | 145.701 | 13,351 | 1.369.553 |

### 500 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 204.775,90 | 1.00 | 2,433 | 207.074 | 212.461 | 218.310 | 221.071 | 228.788 | 101,371 | 2.049.823 |
| Cadente | 152.028,54 | 0.74 | 3,287 | 153.593 | 159.588 | 163.596 | 165.896 | 168.646 | 65,481 | 1.520.370 |
| HttpListener | 139.550,00 | 0.68 | 3,581 | 143.068 | 145.755 | 148.878 | 150.185 | 152.808 | 26,101 | 1.395.451 |
| Sisk (Cadente) | 160.763,47 | 0.79 | 3,109 | 160.903 | 171.071 | 180.064 | 183.467 | 189.980 | 151,670 | 1.606.650 |
| Sisk (HttpListener) | 150.908,10 | 0.74 | 3,311 | 151.892 | 156.148 | 158.554 | 159.597 | 162.404 | 24,514 | 1.509.219 |

### 1000 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 190.508,41 | 1.00 | 5,225 | 192.450 | 201.266 | 208.044 | 210.798 | 216.762 | 185,418 | 1.910.388 |
| Cadente | 142.503,01 | 0.75 | 7,015 | 149.573 | 153.957 | 156.924 | 159.027 | 161.873 | 338,695 | 1.425.009 |
| HttpListener | 137.184,91 | 0.72 | 7,286 | 138.435 | 141.582 | 144.199 | 146.034 | 149.002 | 42,091 | 1.371.869 |
| Sisk (Cadente) | 141.492,23 | 0.74 | 7,084 | 141.986 | 161.937 | 175.378 | 183.367 | 194.531 | 519,676 | 1.410.974 |
| Sisk (HttpListener) | 143.531,85 | 0.75 | 6,964 | 145.295 | 148.302 | 150.692 | 152.152 | 154.558 | 44,182 | 1.435.394 |

## Detailed Metrics by Project

---
### ASP.NET Minimal

**10 Connections:**

- **Requests per second:** 125.260,93
- **Average latency:** 0,077 ms
- **Max latency:** 12,999 ms
- **Total requests:** 1.252.683
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 236.514,91
- **Average latency:** 0,420 ms
- **Max latency:** 19,778 ms
- **Total requests:** 2.365.140
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 204.775,90
- **Average latency:** 2,433 ms
- **Max latency:** 101,371 ms
- **Total requests:** 2.049.823
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 190.508,41
- **Average latency:** 5,225 ms
- **Max latency:** 185,418 ms
- **Total requests:** 1.910.388
- **Failure rate:** 0,02%

---
### Cadente

**10 Connections:**

- **Requests per second:** 107.006,71
- **Average latency:** 0,092 ms
- **Max latency:** 14,999 ms
- **Total requests:** 1.070.021
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 167.171,40
- **Average latency:** 0,596 ms
- **Max latency:** 23,617 ms
- **Total requests:** 1.671.616
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 152.028,54
- **Average latency:** 3,287 ms
- **Max latency:** 65,481 ms
- **Total requests:** 1.520.370
- **Failure rate:** 0,02%

**1000 Connections:**

- **Requests per second:** 142.503,01
- **Average latency:** 7,015 ms
- **Max latency:** 338,695 ms
- **Total requests:** 1.425.009
- **Failure rate:** 0,11%

---
### HttpListener

**10 Connections:**

- **Requests per second:** 82.801,37
- **Average latency:** 0,119 ms
- **Max latency:** 9,390 ms
- **Total requests:** 828.059
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 144.100,16
- **Average latency:** 0,692 ms
- **Max latency:** 13,492 ms
- **Total requests:** 1.440.965
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 139.550,00
- **Average latency:** 3,581 ms
- **Max latency:** 26,101 ms
- **Total requests:** 1.395.451
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 137.184,91
- **Average latency:** 7,286 ms
- **Max latency:** 42,091 ms
- **Total requests:** 1.371.869
- **Failure rate:** 0,00%

---
### Sisk (Cadente)

**10 Connections:**

- **Requests per second:** 102.954,73
- **Average latency:** 0,095 ms
- **Max latency:** 12,999 ms
- **Total requests:** 1.029.621
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 142.861,61
- **Average latency:** 0,697 ms
- **Max latency:** 20,516 ms
- **Total requests:** 1.428.759
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 160.763,47
- **Average latency:** 3,109 ms
- **Max latency:** 151,670 ms
- **Total requests:** 1.606.650
- **Failure rate:** 0,03%

**1000 Connections:**

- **Requests per second:** 141.492,23
- **Average latency:** 7,084 ms
- **Max latency:** 519,676 ms
- **Total requests:** 1.410.974
- **Failure rate:** 0,19%

---
### Sisk (HttpListener)

**10 Connections:**

- **Requests per second:** 78.109,87
- **Average latency:** 0,126 ms
- **Max latency:** 9,379 ms
- **Total requests:** 781.176
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 136.954,20
- **Average latency:** 0,728 ms
- **Max latency:** 13,351 ms
- **Total requests:** 1.369.553
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 150.908,10
- **Average latency:** 3,311 ms
- **Max latency:** 24,514 ms
- **Total requests:** 1.509.219
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 143.531,85
- **Average latency:** 6,964 ms
- **Max latency:** 44,182 ms
- **Total requests:** 1.435.394
- **Failure rate:** 0,00%

