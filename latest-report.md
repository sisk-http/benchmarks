# Benchmark Report

Generated at 2025-11-03T03:42:24.353Z

## Summary

| Baseline | Connections | Requests/s | Avg Latency (ms) | p50 (rps) | p75 (rps) | p90 (rps) | p95 (rps) | p99 (rps) | Max Latency (ms) | Total Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| asp ✓ | 10 | 149052.02 | 0.065 | 150952 | 168145 | 186498 | 187851 | 189807 | 6.408 | 1490617 |
| asp ✓ | 100 | 274328.60 | 0.362 | 278191 | 283756 | 287498 | 289874 | 302354 | 17.285 | 2742929 |
| asp ✓ | 500 | 250850.29 | 1.986 | 254436 | 261764 | 266944 | 271979 | 281452 | 35.049 | 2511192 |
| sisk  | 10 | 92052.73 | 0.107 | 98964 | 99968 | 100568 | 100772 | 101373 | 8.983 | 920485 |
| sisk  | 100 | 152640.91 | 0.653 | 155464 | 157720 | 158974 | 159530 | 187149 | 9.709 | 1526474 |
| sisk  | 500 | 167037.30 | 2.990 | 170053 | 173667 | 175430 | 176718 | 199429 | 21.197 | 1670428 |
| sisk-cadente  | 10 | 156645.89 | 0.062 | 162434 | 164840 | 166393 | 167295 | 168598 | 6.656 | 1566536 |
| sisk-cadente  | 100 | 234418.79 | 0.425 | 238135 | 240784 | 244302 | 246412 | 287969 | 19.475 | 2344520 |
| sisk-cadente  | 500 | 215126.73 | 2.322 | 217682 | 228059 | 238028 | 241143 | 246145 | 161.176 | 2151322 |

## Detailed Metrics by Project

---
### asp

**10 Connections:**

- **Requests per second:** 149052.02
- **Average latency:** 0.065 ms
- **Max latency:** 6.408 ms
- **Total requests:** 1490617
- **Failure rate:** 0.00%

**100 Connections:**

- **Requests per second:** 274328.60
- **Average latency:** 0.362 ms
- **Max latency:** 17.285 ms
- **Total requests:** 2742929
- **Failure rate:** 0.00%

**500 Connections:**

- **Requests per second:** 250850.29
- **Average latency:** 1.986 ms
- **Max latency:** 35.049 ms
- **Total requests:** 2511192
- **Failure rate:** 0.00%

---
### sisk

**10 Connections:**

- **Requests per second:** 92052.73
- **Average latency:** 0.107 ms
- **Max latency:** 8.983 ms
- **Total requests:** 920485
- **Failure rate:** 0.00%

**100 Connections:**

- **Requests per second:** 152640.91
- **Average latency:** 0.653 ms
- **Max latency:** 9.709 ms
- **Total requests:** 1526474
- **Failure rate:** 0.00%

**500 Connections:**

- **Requests per second:** 167037.30
- **Average latency:** 2.990 ms
- **Max latency:** 21.197 ms
- **Total requests:** 1670428
- **Failure rate:** 0.00%

---
### sisk-cadente

**10 Connections:**

- **Requests per second:** 156645.89
- **Average latency:** 0.062 ms
- **Max latency:** 6.656 ms
- **Total requests:** 1566536
- **Failure rate:** 0.00%

**100 Connections:**

- **Requests per second:** 234418.79
- **Average latency:** 0.425 ms
- **Max latency:** 19.475 ms
- **Total requests:** 2344520
- **Failure rate:** 0.00%

**500 Connections:**

- **Requests per second:** 215126.73
- **Average latency:** 2.322 ms
- **Max latency:** 161.176 ms
- **Total requests:** 2151322
- **Failure rate:** 0.04%

