using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Columns;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Diagnosers;
using BenchmarkDotNet.Jobs;
using BenchmarkDotNet.Loggers;
using BenchmarkDotNet.Running;
using Microsoft.Extensions.Logging;

namespace sisk_benchmark;

public static class Program
{
    private static void Main()
    {
        BenchmarkRunner.Run<Test1>(new Config());
        Console.ReadKey();
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