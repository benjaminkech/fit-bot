using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace FitBot.Course
{
    public class Course
    {
        private readonly IHttpClientFactory _clientFactory;

        public Course(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        [Function("Course")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("Course");
            logger.LogInformation("C# HTTP trigger function processed a request.");

            string uri = Settings.Settings.GetEnvironmentVariable("GYM_API");

            var client = _clientFactory.CreateClient();
            var data = await client.GetStringAsync(uri);
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            response.WriteString(data);

            return response;
        }
    }
}
