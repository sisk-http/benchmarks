using Sisk.Core.Http;
using Sisk.Core.Routing;

namespace sisk;

internal class Program
{
    static void Main(string[] args)
    {
        var response = new Sisk.Core.Http.HttpResponse(200).WithContent("Hello World!");
        var http = HttpServer.Emit(insecureHttpPort: 5222, out var config, out _, out var mainRouter);
        config.AccessLogsStream = null;
        config.Flags.NormalizeHeadersEncodings = false;
        config.Flags.SendSiskHeader = false;
        config.IncludeRequestIdHeader = false;

        mainRouter += new Sisk.Core.Routing.Route(RouteMethod.Get, "/",
            request => response
        );
        http.Start();
        Thread.Sleep(-1);
    }
}
