using Sisk.Core.Http;

class Program {
    static void Main ( string [] args ) {
        using var app = HttpServer.CreateBuilder ( 5222 )
            .UseConfiguration ( config => {
                config.AccessLogsStream = null;
            } )
            .Build ();

        app.Router.MapGet ( "/", request => new HttpResponse ( "Hello, world!" ) );

        app.Start ();
    }
}