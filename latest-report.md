# Benchmark Report

Generated at 2025-11-07T18:32:27.245Z

## AI generated insights

### Key Points
- **Projects Tested**: Four variants—asp (likely ASP.NET), sisk (base), sisk-cadente, and sisk-cadente-core—evaluated under concurrent connections of 10, 100, 500, and 1000.
- **Metrics Covered**: Requests per second (RPS), average/max latency (ms), total requests, failure rates (all near 0%, except minor increases at 1000 connections for sisk variants), and percentiles (p50–p99 RPS).
- **General Trends**:
  - All projects scale RPS with connections, peaking at 100–500 connections before stabilizing or dipping at 1000.
  - Latency rises with connections across all: low (<1 ms) at 10–100, moderate (3–9 ms) at 500–1000.
  - Max latency spikes significantly at higher loads (e.g., >100 ms for most at 500+ connections), with sisk-cadente showing the highest (318 ms at 1000).
  - Failure rates remain negligible (0–0.12%), indicating robust error handling.
- **Peak Performers**:
  - Highest RPS: asp at 100 connections (223.6k).
  - Lowest average latency: sisk-cadente at 10 connections (0.087 ms).
  - Highest total requests: asp at 100 connections (2.24M).

### Insights
- **Scalability**: asp excels in mid-range loads (100–1000 connections) with consistent RPS and low variance, while sisk variants show more fluctuation, dropping at 1000 connections possibly due to resource contention. sisk-cadente-core maintains steady performance up to 500 connections.
- **Latency Trade-offs**: Lower latencies correlate with higher RPS at low loads, but all experience tail latency issues (high p99 RPS and max values) under stress, suggesting potential bottlenecks in async handling or I/O.
- **Overall Comparison**: No single project dominates; asp favors throughput, sisk-cadente prioritizes low-latency responsiveness at low loads, and core variants balance efficiency but with higher failure risks at scale. Results imply suitability depends on load profiles—e.g., asp for high-volume, sisk for lightweight setups. Test date (2025-11-07) indicates forward-looking benchmark, likely on standardized hardware.

## Summary

| Project | Connections | Requests/s | Ratio | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| asp ✓ | 10 | 107.976,40 | 0.96 | 0,090 | 109.597 | 126.301 | 131.003 | 132.401 | 134.197 | 20,677 | 1.079.687 |
| asp ✓ | 100 | 223.612,16 | 1.00 | 0,444 | 233.307 | 243.177 | 248.911 | 252.383 | 257.075 | 20,367 | 2.236.133 |
| asp ✓ | 500 | 167.582,99 | 1.00 | 2,967 | 171.036 | 190.906 | 206.098 | 213.179 | 221.520 | 81,362 | 1.679.561 |
| asp ✓ | 1000 | 175.807,70 | 1.00 | 5,671 | 180.931 | 193.403 | 202.262 | 206.590 | 213.880 | 253,227 | 1.761.406 |
| sisk | 10 | 70.283,22 | 0.63 | 0,141 | 72.994 | 75.863 | 77.799 | 79.150 | 80.541 | 53,065 | 703.743 |
| sisk | 100 | 114.794,16 | 0.51 | 0,868 | 124.016 | 131.953 | 136.984 | 139.597 | 142.952 | 98,954 | 1.148.188 |
| sisk | 500 | 135.481,71 | 0.81 | 3,687 | 143.685 | 150.197 | 155.415 | 157.845 | 160.651 | 129,008 | 1.354.971 |
| sisk | 1000 | 114.068,41 | 0.65 | 8,763 | 125.228 | 133.852 | 140.552 | 144.006 | 152.063 | 124,127 | 1.140.755 |
| sisk-cadente | 10 | 112.054,64 | 1.00 | 0,087 | 112.400 | 113.699 | 114.599 | 115.101 | 119.185 | 14,999 | 1.120.534 |
| sisk-cadente | 100 | 169.643,47 | 0.76 | 0,588 | 171.194 | 174.852 | 177.551 | 179.303 | 184.853 | 19,276 | 1.696.754 |
| sisk-cadente | 500 | 153.432,89 | 0.92 | 3,257 | 153.193 | 160.928 | 165.435 | 167.058 | 171.003 | 64,849 | 1.534.349 |
| sisk-cadente | 1000 | 138.854,44 | 0.79 | 7,200 | 145.055 | 149.896 | 152.504 | 153.677 | 157.302 | 318,193 | 1.388.323 |
| sisk-cadente-core | 10 | 99.286,19 | 0.89 | 0,099 | 101.903 | 104.449 | 106.099 | 107.703 | 109.803 | 9,128 | 992.881 |
| sisk-cadente-core | 100 | 143.416,97 | 0.64 | 0,695 | 144.148 | 148.609 | 151.936 | 154.224 | 157.842 | 18,565 | 1.434.073 |
| sisk-cadente-core | 500 | 159.675,22 | 0.95 | 3,128 | 159.595 | 168.194 | 177.750 | 182.649 | 188.498 | 221,958 | 1.596.994 |
| sisk-cadente-core | 1000 | 138.493,19 | 0.79 | 7,204 | 137.283 | 158.893 | 174.652 | 181.351 | 191.743 | 287,028 | 1.381.969 |

## Detailed Metrics by Project

---
### asp

**10 Connections:**

- **Requests per second:** 107.976,40
- **Average latency:** 0,090 ms
- **Max latency:** 20,677 ms
- **Total requests:** 1.079.687
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 223.612,16
- **Average latency:** 0,444 ms
- **Max latency:** 20,367 ms
- **Total requests:** 2.236.133
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 167.582,99
- **Average latency:** 2,967 ms
- **Max latency:** 81,362 ms
- **Total requests:** 1.679.561
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 175.807,70
- **Average latency:** 5,671 ms
- **Max latency:** 253,227 ms
- **Total requests:** 1.761.406
- **Failure rate:** 0,02%

---
### sisk

**10 Connections:**

- **Requests per second:** 70.283,22
- **Average latency:** 0,141 ms
- **Max latency:** 53,065 ms
- **Total requests:** 703.743
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 114.794,16
- **Average latency:** 0,868 ms
- **Max latency:** 98,954 ms
- **Total requests:** 1.148.188
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 135.481,71
- **Average latency:** 3,687 ms
- **Max latency:** 129,008 ms
- **Total requests:** 1.354.971
- **Failure rate:** 0,00%

**1000 Connections:**

- **Requests per second:** 114.068,41
- **Average latency:** 8,763 ms
- **Max latency:** 124,127 ms
- **Total requests:** 1.140.755
- **Failure rate:** 0,00%

---
### sisk-cadente

**10 Connections:**

- **Requests per second:** 112.054,64
- **Average latency:** 0,087 ms
- **Max latency:** 14,999 ms
- **Total requests:** 1.120.534
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 169.643,47
- **Average latency:** 0,588 ms
- **Max latency:** 19,276 ms
- **Total requests:** 1.696.754
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 153.432,89
- **Average latency:** 3,257 ms
- **Max latency:** 64,849 ms
- **Total requests:** 1.534.349
- **Failure rate:** 0,02%

**1000 Connections:**

- **Requests per second:** 138.854,44
- **Average latency:** 7,200 ms
- **Max latency:** 318,193 ms
- **Total requests:** 1.388.323
- **Failure rate:** 0,12%

---
### sisk-cadente-core

**10 Connections:**

- **Requests per second:** 99.286,19
- **Average latency:** 0,099 ms
- **Max latency:** 9,128 ms
- **Total requests:** 992.881
- **Failure rate:** 0,00%

**100 Connections:**

- **Requests per second:** 143.416,97
- **Average latency:** 0,695 ms
- **Max latency:** 18,565 ms
- **Total requests:** 1.434.073
- **Failure rate:** 0,00%

**500 Connections:**

- **Requests per second:** 159.675,22
- **Average latency:** 3,128 ms
- **Max latency:** 221,958 ms
- **Total requests:** 1.596.994
- **Failure rate:** 0,03%

**1000 Connections:**

- **Requests per second:** 138.493,19
- **Average latency:** 7,204 ms
- **Max latency:** 287,028 ms
- **Total requests:** 1.381.969
- **Failure rate:** 0,11%

