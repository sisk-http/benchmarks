using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

namespace sisk_benchmark;

public static class Program
{
    private static void Main()
    {
        BenchmarkRunner.Run<SiskVsMinimalBenckmark>();
    }
}

public class SiskVsMinimalBenckmark
{
    private HttpClient? _httpClient;

    [GlobalSetup]
    public void Setup() => _httpClient = new HttpClient();

    [Benchmark]
    public async Task AspNetMinimal() => await _httpClient!.GetStringAsync("http://localhost:5000/");

    [Benchmark]
    public async Task SiskDotNet() => await _httpClient!.GetStringAsync("http://localhost:5222/");

    [Benchmark]
    public async Task SiskBFlat() => await _httpClient!.GetStringAsync("http://localhost:5111/");
}