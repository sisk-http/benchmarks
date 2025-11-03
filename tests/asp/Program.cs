namespace asp;

public class Program {
    public static void Main ( string [] args ) {
        var builder = WebApplication.CreateBuilder ( args );
        var app = builder.Build ();

        app.MapGet ( "/plaintext", () => "Hello World!" );
        
        app.Run ( "http://localhost:5111/" );
    }
}
