using Sisk.Core.Http;
using Sisk.Core.Routing;

var response = new Sisk.Core.Http.HttpResponse(200).WithContent("Hello World!");
var server = HttpServer.Emit(5111, out HttpServerConfiguration config, out ListeningHost host, out Router router);
config.AccessLogsStream = null;
config.Flags.NormalizeHeadersEncodings = false;
config.Flags.SendSiskHeader = false;
config.IncludeRequestIdHeader = false;

router += new Route(RouteMethod.Get, "/", request => response);

server.Start();
System.Threading.Thread.Sleep(-1);