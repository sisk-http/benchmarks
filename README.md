# Benchmark test between Sisk and ASP.NET

	[Host]     : .NET 6.0.16 (6.0.1623.17311), X64 RyuJIT AVX2
	DefaultJob : .NET 6.0.16 (6.0.1623.17311), X64 RyuJIT AVX2

|        Method |     Mean |   Error |  StdDev |
|-------------- |---------:|--------:|--------:|
| AspNetMinimal | 101.9 us | 1.13 us | 0.95 us |
|    SiskDotNet | 108.4 us | 1.50 us | 1.40 us |
|     SiskBFlat | 109.9 us | 1.58 us | 1.48 us |

Both HTTP servers was configured to return an plain `Hello, world!`.

ASP.NET project is using Kestrel.
