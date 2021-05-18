using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace api
{
    public class Program
    {
        public static void Main()
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureServices(s =>
                {
                    s.AddHttpClient();
                })
                .Build();

            host.Run();
        }
    }
}