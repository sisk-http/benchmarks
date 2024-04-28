using Sisk.Core.Http;
using Sisk.Core.Routing;

class Program
{
    static void Main(string[] args)
    {
        var app = HttpServer.CreateBuilder(host => host.UseListeningPort(5222));
        
        app.Router.SetRoute(RouteMethod.Get, "/", req => new HttpResponse("Hello, world!"));

        app.Start();
    }
}