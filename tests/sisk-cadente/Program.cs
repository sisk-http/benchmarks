using Sisk.Cadente;

internal class Program
{
    static async Task Main(string[] args)
    {
        var cadenteHost = new HttpHost(5333)
        {
            Handler = new HostHandler()
        };

        cadenteHost.Start();
        Thread.Sleep(-1);
    }
}

sealed class HostHandler : HttpHostHandler
{
    byte[] HelloBytes = "Hello, Cadente!"u8.ToArray();

    public override async Task OnContextCreatedAsync(HttpHost host, HttpHostContext context)
    {
        context.Response.StatusCode = 200;
        context.Response.Headers.Set(new HttpHeader("Content-Type", "text/plain; charset=utf-8"));
        context.Response.Headers.Set(new HttpHeader("Content-Length", HelloBytes.Length.ToString()));
        using var contentStream = await context.Response.GetResponseStreamAsync(chunked: false);

        await contentStream.WriteAsync(HelloBytes, 0, HelloBytes.Length);
    }
}