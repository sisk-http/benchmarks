using System.Net;

internal class Program
{
    static byte[] HelloBytes = "Hello, HttpListener!"u8.ToArray();

    static async Task Main(string[] args)
    {
        using var http = new HttpListener();
        http.Prefixes.Add("http://localhost:5556/");

        http.Start();
        http.BeginGetContext(ProcessContext, http);

        Thread.Sleep(-1);
    }

    static void ProcessContext(IAsyncResult ar)
    {
        var state = (HttpListener)ar.AsyncState!;

        var context = state.EndGetContext(ar);
        state.BeginGetContext(ProcessContext, state);

        context.Response.StatusCode = 200;
        context.Response.ContentType = "text/plain";
        context.Response.OutputStream.Write(HelloBytes);

        context.Response.Close();
    }
}