using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;

namespace FitBot.Course
{
    public class Course
    {
        private readonly HttpClient _http;
        public Course(HttpClient httpClient)
        {
            _http = httpClient;
        }

        [FunctionName("Course")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string url = Settings.Settings.GetEnvironmentVariable("MIGROS_API");

            var response = await _http.GetStringAsync(url);

            return new OkObjectResult(response);
        }
    }
}
