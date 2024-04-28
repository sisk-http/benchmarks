# Benchmark test between Sisk and ASP.NET

The tests below were performed to improve the quality of Sisk. All tests are reproducible and were run on a personal machine and not a server. I will soon add tests on a production server.

Both applications were compiled in RELEASE and return a plain "Hello, world!". The K6 version used in these tests was v0.46.0.

Sisk could handle 55.462 requests per second while ASP.NET got 63.728, using their Kestrel socket implementation. Sisk does uses HttpListener.

## Benchmark.NET

```
BenchmarkDotNet v0.13.7, Windows 10 (10.0.19044.4291/21H2/November2021Update)
Intel Core i3-10105F CPU 3.70GHz, 1 CPU, 8 logical and 4 physical cores
.NET SDK 9.0.100-preview.3.24204.13
  [Host]     : .NET 8.0.4 (8.0.424.16909), X64 RyuJIT AVX2
  DefaultJob : .NET 8.0.4 (8.0.424.16909), X64 RyuJIT AVX2


|     Mean |   StdDev |   StdErr |     Op/s |     Framework |
|---------:|---------:|---------:|---------:|-------------- |
| 52.71 us | 1.754 us | 0.285 us | 18,970.8 | AspNetMinimal |
| 63.14 us | 0.187 us | 0.050 us | 15,838.4 |    SiskDotNet |

```

## K6

Sisk:

```
     execution: local
        script: k6-sisk.js
        output: -

     scenarios: (100.00%) 1 scenario, 500 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 500 looping VUs for 1m0s (gracefulStop: 30s)


     data_received..................: 630 MB  11 MB/s
     data_sent......................: 271 MB  4.5 MB/s
     http_req_blocked...............: avg=1.76µs  min=0s med=0s     max=26.63ms  p(90)=0s      p(95)=0s
     http_req_connecting............: avg=109ns   min=0s med=0s     max=4.98ms   p(90)=0s      p(95)=0s
     http_req_duration..............: avg=8.79ms  min=0s med=8.1ms  max=237ms    p(90)=11.96ms p(95)=13.89ms
       { expected_response:true }...: avg=8.79ms  min=0s med=8.1ms  max=237ms    p(90)=11.96ms p(95)=13.89ms
     http_req_failed................: 0.00%   ✓ 0            ✗ 3388041
     http_req_receiving.............: avg=264.8µs min=0s med=0s     max=50.39ms  p(90)=0s      p(95)=0s
     http_req_sending...............: avg=11.59µs min=0s med=0s     max=65.94ms  p(90)=0s      p(95)=0s
     http_req_tls_handshaking.......: avg=0s      min=0s med=0s     max=0s       p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=8.51ms  min=0s med=8.06ms max=234.01ms p(90)=11.96ms p(95)=13.78ms
     http_reqs......................: 3388041 56462.140897/s
     iteration_duration.............: avg=8.84ms  min=0s med=8.14ms max=244.61ms p(90)=11.96ms p(95)=13.95ms
     iterations.....................: 3388041 56462.140897/s
     vus............................: 500     min=500        max=500
     vus_max........................: 500     min=500        max=500
```

ASP.NET Minimal:

```
     execution: local
        script: k6-asp.js
        output: -

     scenarios: (100.00%) 1 scenario, 500 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 500 looping VUs for 1m0s (gracefulStop: 30s)

     data_received..................: 627 MB  10 MB/s
     data_sent......................: 306 MB  5.1 MB/s
     http_req_blocked...............: avg=2.44µs   min=0s med=0s     max=110.6ms  p(90)=0s     p(95)=0s
     http_req_connecting............: avg=109ns    min=0s med=0s     max=9.62ms   p(90)=0s     p(95)=0s
     http_req_duration..............: avg=7.61ms   min=0s med=6.98ms max=269.14ms p(90)=9.25ms p(95)=11.12ms
       { expected_response:true }...: avg=7.61ms   min=0s med=6.98ms max=269.14ms p(90)=9.25ms p(95)=11.13ms
     http_req_failed................: 0.03%   ✓ 1367         ✗ 3822574
     http_req_receiving.............: avg=316.12µs min=0s med=0s     max=150.44ms p(90)=0s     p(95)=0s
     http_req_sending...............: avg=16.03µs  min=0s med=0s     max=135.54ms p(90)=0s     p(95)=0s
     http_req_tls_handshaking.......: avg=0s       min=0s med=0s     max=0s       p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=7.28ms   min=0s med=6.98ms max=269.14ms p(90)=9.15ms p(95)=10.97ms
     http_reqs......................: 3823941 63728.188762/s
     iteration_duration.............: avg=7.8ms    min=0s med=6.98ms max=276.77ms p(90)=9.65ms p(95)=11.7ms
     iterations.....................: 3823941 63728.188762/s
     vus............................: 500     min=500        max=500
     vus_max........................: 500     min=500        max=500
```