# Benchmark Report

Generated at 2025-11-26T02:41:20.206Z

## Environment

- **Processor:** 11th Gen Intel(R) Core(TM) i5-11400F @ 2.60GHz
- **Operating system:** Windows_NT 10.0.19044 (win32)
- **Architecture:** x64
- **RAM:** 31.86 GB
- **.NET executable:** dotnet 10.0.100
- **Bombardier:** bombardier (version unknown)

## AI generated insights

### Key Points
- **Benchmark Setup**: .NET-based HTTP servers tested with Bombardier on Windows/Intel i5 (32GB RAM); concurrency levels: 10/100/500/1000; all 0% failure rates; ASP.NET Minimal as baseline (ratio 1.00).
- **Throughput (Req/s)**:
  | Concurrency | Top Performer | Range (req/s) |
  |-------------|---------------|---------------|
  | 10         | ASP.NET (131k) | 80k–131k     |
  | 100        | ASP.NET (248k) | 121k–248k    |
  | 500        | ASP.NET (218k) | 121k–218k    |
  | 1000       | ASP.NET (197k) | 120k–197k    |
- **Latency Trends**: Avg latency rises with concurrency (0.07–8ms range); ASP.NET consistently lowest; max latencies 20–154ms, highest for ASP.NET/Sisk(Cadente) at 1000 conn.
- **Ratios to ASP.NET**: Cadente/Sisk(Cadente) 0.73–0.90; HttpListener/Sisk(HttpListener) 0.49–0.71.
- **Variants**: Cadente-based (standalone/Sisk) outperform HttpListener-based across loads.

### Insights
- Peak throughput at 100 connections for all; drops 20–50% at 500–1000 due to contention.
- ASP.NET leads in throughput/latency; Cadente competitive at low loads; HttpListener stable but lower overall.
- Sisk(Cadente) ≈ Cadente standalone; HttpListener limits Sisk performance.
- Test shows hardware/concurrency sensitivity; results hardware-specific, no errors indicate stability.

## Summary

### 10 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 130.674,01 | 1.00 | 0,074 | 131.704 | 133.699 | 135.451 | 136.652 | 138.801 | 17,714 | 5.880.350 |
| Cadente | 117.437,52 | 0.90 | 0,083 | 118.449 | 119.795 | 121.149 | 121.867 | 123.484 | 22,556 | 5.284.849 |
| HttpListener | 82.546,52 | 0.63 | 0,119 | 83.500 | 84.492 | 85.147 | 85.551 | 86.800 | 21,533 | 3.714.598 |
| Sisk (Cadente) | 113.566,20 | 0.87 | 0,086 | 115.163 | 116.945 | 118.601 | 119.499 | 122.202 | 22,775 | 5.110.738 |
| Sisk (HttpListener) | 80.473,91 | 0.62 | 0,123 | 81.606 | 82.300 | 82.852 | 83.152 | 84.110 | 20,610 | 3.621.343 |

### 100 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 247.986,86 | 1.00 | 0,401 | 250.683 | 254.649 | 258.559 | 261.907 | 267.849 | 24,512 | 11.159.964 |
| Cadente | 194.592,25 | 0.78 | 0,512 | 196.637 | 199.198 | 201.740 | 203.336 | 206.095 | 30,533 | 8.756.846 |
| HttpListener | 147.257,20 | 0.59 | 0,677 | 148.497 | 150.447 | 152.200 | 153.348 | 154.891 | 22,603 | 6.626.606 |
| Sisk (Cadente) | 182.877,33 | 0.74 | 0,544 | 189.228 | 192.692 | 195.664 | 198.504 | 206.486 | 25,633 | 8.229.042 |
| Sisk (HttpListener) | 121.202,83 | 0.49 | 0,823 | 122.346 | 124.298 | 125.896 | 126.594 | 128.350 | 24,337 | 5.454.318 |

### 500 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 218.371,05 | 1.00 | 2,282 | 220.430 | 226.613 | 231.529 | 234.760 | 240.826 | 53,129 | 9.835.352 |
| Cadente | 159.104,68 | 0.73 | 3,140 | 162.393 | 165.492 | 168.293 | 169.718 | 172.698 | 39,208 | 7.160.120 |
| HttpListener | 137.498,58 | 0.63 | 3,634 | 142.451 | 145.954 | 148.989 | 150.839 | 153.390 | 26,025 | 6.187.589 |
| Sisk (Cadente) | 161.339,55 | 0.74 | 3,099 | 161.918 | 173.287 | 182.069 | 185.751 | 192.950 | 51,092 | 7.254.702 |
| Sisk (HttpListener) | 121.368,15 | 0.56 | 4,117 | 122.741 | 124.001 | 124.621 | 125.601 | 127.780 | 29,802 | 5.462.009 |

### 1000 connections

| Project | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ASP.NET Minimal ✓ | 196.626,64 | 1.00 | 5,068 | 198.811 | 205.870 | 212.506 | 215.715 | 223.678 | 153,944 | 8.863.902 |
| Cadente | 144.663,05 | 0.74 | 6,911 | 148.886 | 151.362 | 154.203 | 156.052 | 161.497 | 77,978 | 6.509.609 |
| HttpListener | 138.632,38 | 0.71 | 7,211 | 140.106 | 143.601 | 145.947 | 146.901 | 148.239 | 47,262 | 6.239.074 |
| Sisk (Cadente) | 143.864,44 | 0.73 | 6,990 | 146.288 | 165.586 | 179.509 | 185.409 | 193.974 | 107,847 | 6.436.348 |
| Sisk (HttpListener) | 119.557,54 | 0.61 | 8,361 | 120.356 | 122.199 | 123.700 | 124.005 | 124.299 | 40,137 | 5.380.478 |

## Detailed Metrics by Project

---
### ASP.NET Minimal

**10 Connections:**

- **Requests per second:** 130.674,01
- **Average latency:** 0,074 ms
- **Max latency:** 17,714 ms
- **Total requests:** 5.880.350
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 247.986,86
- **Average latency:** 0,401 ms
- **Max latency:** 24,512 ms
- **Total requests:** 11.159.964
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 218.371,05
- **Average latency:** 2,282 ms
- **Max latency:** 53,129 ms
- **Total requests:** 9.835.352
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 196.626,64
- **Average latency:** 5,068 ms
- **Max latency:** 153,944 ms
- **Total requests:** 8.863.902
- **Failure rate:** 0,00%

---
### Cadente

**10 Connections:**

- **Requests per second:** 117.437,52
- **Average latency:** 0,083 ms
- **Max latency:** 22,556 ms
- **Total requests:** 5.284.849
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 194.592,25
- **Average latency:** 0,512 ms
- **Max latency:** 30,533 ms
- **Total requests:** 8.756.846
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 159.104,68
- **Average latency:** 3,140 ms
- **Max latency:** 39,208 ms
- **Total requests:** 7.160.120
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 144.663,05
- **Average latency:** 6,911 ms
- **Max latency:** 77,978 ms
- **Total requests:** 6.509.609
- **Failure rate:** 0,00%

---
### HttpListener

**10 Connections:**

- **Requests per second:** 82.546,52
- **Average latency:** 0,119 ms
- **Max latency:** 21,533 ms
- **Total requests:** 3.714.598
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 147.257,20
- **Average latency:** 0,677 ms
- **Max latency:** 22,603 ms
- **Total requests:** 6.626.606
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 137.498,58
- **Average latency:** 3,634 ms
- **Max latency:** 26,025 ms
- **Total requests:** 6.187.589
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 138.632,38
- **Average latency:** 7,211 ms
- **Max latency:** 47,262 ms
- **Total requests:** 6.239.074
- **Failure rate:** 0,00%

---
### Sisk (Cadente)

**10 Connections:**

- **Requests per second:** 113.566,20
- **Average latency:** 0,086 ms
- **Max latency:** 22,775 ms
- **Total requests:** 5.110.738
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 182.877,33
- **Average latency:** 0,544 ms
- **Max latency:** 25,633 ms
- **Total requests:** 8.229.042
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 161.339,55
- **Average latency:** 3,099 ms
- **Max latency:** 51,092 ms
- **Total requests:** 7.254.702
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 143.864,44
- **Average latency:** 6,990 ms
- **Max latency:** 107,847 ms
- **Total requests:** 6.436.348
- **Failure rate:** 0,00%

---
### Sisk (HttpListener)

**10 Connections:**

- **Requests per second:** 80.473,91
- **Average latency:** 0,123 ms
- **Max latency:** 20,610 ms
- **Total requests:** 3.621.343
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 121.202,83
- **Average latency:** 0,823 ms
- **Max latency:** 24,337 ms
- **Total requests:** 5.454.318
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 121.368,15
- **Average latency:** 4,117 ms
- **Max latency:** 29,802 ms
- **Total requests:** 5.462.009
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 119.557,54
- **Average latency:** 8,361 ms
- **Max latency:** 40,137 ms
- **Total requests:** 5.380.478
- **Failure rate:** 0,00%

