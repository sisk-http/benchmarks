# Benchmark test between Sisk and ASP.NET

The tests below were performed to improve the quality of Sisk. All tests are reproducible and were run on a personal machine and not a server. I will soon add tests on a production server.

Both applications were compiled in RELEASE and return a plain "Hello, world!". The K6 version used in these tests was v0.46.0.

Sisk could handle 80.850,89 requests per second while ASP.NET got 87.962,17, using their Kestrel socket implementation. An difference of ~8,79%. Sisk does uses HttpListener.

## Benchmark.NET

```
// * Summary *

BenchmarkDotNet v0.13.12, Windows 10 (10.0.19044.4529/21H2/November2021Update)
11th Gen Intel Core i5-11400F 2.60GHz, 1 CPU, 12 logical and 6 physical cores
.NET SDK 9.0.100-preview.4.24267.66
  [Host]     : .NET 8.0.5 (8.0.524.21615), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI [AttachedDebugger]
  DefaultJob : .NET 8.0.5 (8.0.524.21615), X64 RyuJIT AVX-512F+CD+BW+DQ+VL+VBMI


| Mean     | StdDev   | StdErr   | Op/s     | Framework     |
|---------:|---------:|---------:|---------:|-------------- |
| 59.49 us | 1.355 us | 0.303 us | 16,809.0 | AspNetMinimal |
| 68.19 us | 1.195 us | 0.309 us | 14,664.2 | SiskDotNet    |

// * Legends *
  Mean      : Arithmetic mean of all measurements
  StdDev    : Standard deviation of all measurements
  StdErr    : Standard error of all measurements
  Op/s      : Operation per second
  Framework : Custom 'Framework' tag column
  1 us      : 1 Microsecond (0.000001 sec)
```

## K6

Sisk:

```
     execution: local
        script: sisk-test.k6.js
        output: -

     scenarios: (100.00%) 1 scenario, 500 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 500 looping VUs for 1m0s (gracefulStop: 30s)


     data_received..................: 898 MB  15 MB/s
     data_sent......................: 388 MB  6.5 MB/s
     http_req_blocked...............: avg=2.05µs   min=0s med=0s     max=35.84ms p(90)=0s     p(95)=0s
     http_req_connecting............: avg=376ns    min=0s med=0s     max=35.84ms p(90)=0s     p(95)=0s
     http_req_duration..............: avg=6.12ms   min=0s med=5.99ms max=60.38ms p(90)=8.35ms p(95)=9.87ms
       { expected_response:true }...: avg=6.12ms   min=0s med=5.99ms max=60.38ms p(90)=8.35ms p(95)=9.87ms
     http_req_failed................: 0.00%   ✓ 0            ✗ 4851382
     http_req_receiving.............: avg=159.91µs min=0s med=0s     max=38.88ms p(90)=0s     p(95)=0s
     http_req_sending...............: avg=12.32µs  min=0s med=0s     max=40.99ms p(90)=0s     p(95)=0s
     http_req_tls_handshaking.......: avg=0s       min=0s med=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=5.95ms   min=0s med=5.99ms max=37.02ms p(90)=8.22ms p(95)=9.6ms
     http_reqs......................: 4851382 80850.894543/s
     iteration_duration.............: avg=6.17ms   min=0s med=5.99ms max=60.38ms p(90)=8.51ms p(95)=9.99ms
     iterations.....................: 4851382 80850.894543/s
     vus............................: 500     min=500        max=500
     vus_max........................: 500     min=500        max=500
```

ASP.NET Minimal:

```
     execution: local
        script: asp-test.k6.js
        output: -

     scenarios: (100.00%) 1 scenario, 500 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 500 looping VUs for 1m0s (gracefulStop: 30s)

     data_received..................: 866 MB  14 MB/s
     data_sent......................: 422 MB  7.0 MB/s
     http_req_blocked...............: avg=2.87µs   min=0s med=0s  max=66ms     p(90)=0s     p(95)=0s
     http_req_connecting............: avg=132ns    min=0s med=0s  max=16.15ms  p(90)=0s     p(95)=0s
     http_req_duration..............: avg=5.45ms   min=0s med=5ms max=98.68ms  p(90)=6.99ms p(95)=8ms
       { expected_response:true }...: avg=5.45ms   min=0s med=5ms max=98.68ms  p(90)=6.99ms p(95)=8ms
     http_req_failed................: 0.00%   ✓ 182          ✗ 5277770
     http_req_receiving.............: avg=258.83µs min=0s med=0s  max=88.2ms   p(90)=0s     p(95)=0s
     http_req_sending...............: avg=17.84µs  min=0s med=0s  max=87ms     p(90)=0s     p(95)=0s
     http_req_tls_handshaking.......: avg=0s       min=0s med=0s  max=0s       p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=5.17ms   min=0s med=5ms max=98.18ms  p(90)=6.99ms p(95)=7.99ms
     http_reqs......................: 5277952 87962.173721/s
     iteration_duration.............: avg=5.62ms   min=0s med=5ms max=549.06ms p(90)=7ms    p(95)=8.19ms
     iterations.....................: 5277952 87962.173721/s
     vus............................: 500     min=500        max=500
     vus_max........................: 500     min=500        max=500
```