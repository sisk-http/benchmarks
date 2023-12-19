# Benchmark test between Sisk and ASP.NET

The tests below were performed to improve the quality of Sisk. All tests are reproducible and were run on a personal machine and not a server. I will soon add tests on a production server.

Both applications were compiled in RELEASE and return a plain "Hello, world!". The K6 version used in these tests was v0.46.0.

Sisk could handle 44.029 requests per second while ASP.NET got 51.766, using their Kestrel socket implementation. Sisk does uses HttpListener. Sisk is around 15%-20% slower than ASP.NET/Kestrel. We need to improve it.

## Benchmark.NET

```
BenchmarkDotNet v0.13.7, Windows 11 (10.0.22631.2861)
Intel Core i3-10105F CPU 3.70GHz, 1 CPU, 8 logical and 4 physical cores
.NET SDK 8.0.100
  [Host]     : .NET 8.0.0 (8.0.23.53103), X64 RyuJIT AVX2
  DefaultJob : .NET 8.0.0 (8.0.23.53103), X64 RyuJIT AVX2
```

| Framework     |      Mean |   StdDev |   StdErr |     Op/s |
|-------------- |----------:|---------:|---------:|---------:|
| AspNetMinimal |  96.64 us | 0.380 us | 0.095 us | 10,348.1 |
| SiskDotNet    | 110.36 us | 0.383 us | 0.099 us |  9,061.4 |

## K6

Sisk:

```
  scenarios: (100.00%) 1 scenario, 500 max VUs, 1m0s max duration (incl. graceful stop):
           * default: 500 looping VUs for 30s (gracefulStop: 30s)


     data_received..................: 246 MB  8.2 MB/s
     data_sent......................: 106 MB  3.5 MB/s
     http_req_blocked...............: avg=7.84µs  min=0s med=0s      max=70.35ms  p(90)=0s      p(95)=0s
     http_req_connecting............: avg=3.88µs  min=0s med=0s      max=22.57ms  p(90)=0s      p(95)=0s
     http_req_duration..............: avg=11.18ms min=0s med=10.53ms max=111.62ms p(90)=15.34ms p(95)=18.64ms
       { expected_response:true }...: avg=11.18ms min=0s med=10.53ms max=111.62ms p(90)=15.34ms p(95)=18.64ms
     http_req_failed................: 0.00%   ✓ 0            ✗ 1321362
     http_req_receiving.............: avg=41.89µs min=0s med=0s      max=93.87ms  p(90)=0s      p(95)=0s
     http_req_sending...............: avg=15.95µs min=0s med=0s      max=88.68ms  p(90)=0s      p(95)=0s
     http_req_tls_handshaking.......: avg=0s      min=0s med=0s      max=0s       p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=11.12ms min=0s med=10.52ms max=81.43ms  p(90)=15.27ms p(95)=18.51ms
     http_reqs......................: 1321362 44029.579878/s
     iteration_duration.............: avg=11.31ms min=0s med=10.58ms max=111.62ms p(90)=15.55ms p(95)=19.48ms
     iterations.....................: 1321362 44029.579878/s
     vus............................: 500     min=500        max=500
     vus_max........................: 500     min=500        max=500
```

ASP.NET Minimal:

```
  scenarios: (100.00%) 1 scenario, 500 max VUs, 1m0s max duration (incl. graceful stop):
           * default: 500 looping VUs for 30s (gracefulStop: 30s)


     data_received..................: 255 MB  8.5 MB/s
     data_sent......................: 124 MB  4.1 MB/s
     http_req_blocked...............: avg=105.19µs min=0s med=0s     max=537.38ms p(90)=0s      p(95)=0s
     http_req_connecting............: avg=97.47µs  min=0s med=0s     max=530.34ms p(90)=0s      p(95)=0s
     http_req_duration..............: avg=9.03ms   min=0s med=8.52ms max=306.34ms p(90)=11.24ms p(95)=14.81ms
       { expected_response:true }...: avg=9.03ms   min=0s med=8.52ms max=306.34ms p(90)=11.24ms p(95)=14.81ms
     http_req_failed................: 0.00%   ✓ 0            ✗ 1553207
     http_req_receiving.............: avg=48.53µs  min=0s med=0s     max=296.69ms p(90)=0s      p(95)=0s
     http_req_sending...............: avg=20.31µs  min=0s med=0s     max=86.06ms  p(90)=0s      p(95)=0s
     http_req_tls_handshaking.......: avg=0s       min=0s med=0s     max=0s       p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=8.96ms   min=0s med=8.52ms max=196.61ms p(90)=11.14ms p(95)=14.49ms
     http_reqs......................: 1553207 51766.383908/s
     iteration_duration.............: avg=9.56ms   min=0s med=8.52ms max=566.56ms p(90)=11.68ms p(95)=16.93ms
     iterations.....................: 1553207 51766.383908/s
     vus............................: 500     min=500        max=500
     vus_max........................: 500     min=500        max=500
```