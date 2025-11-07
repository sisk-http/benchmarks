
using Sisk.Cadente.CoreEngine;
using Sisk.Core.Http;

using var httpServer = HttpServer.CreateBuilder(5444)
    .UseEngine(new CadenteHttpServerEngine())
    .UseConfiguration ( config => {
        config.AccessLogsStream = null;
    } )
    .UseRouter(r =>
    {
        r.MapGet("/", (HttpRequest request) =>
        {
            return new HttpResponse("Hello, world!");
        });
    })
    .Build();

httpServer.Start();