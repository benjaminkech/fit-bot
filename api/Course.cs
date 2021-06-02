using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
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
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "course/{userId}")] HttpRequestMessage req,
            string userId,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string api = await Settings.Settings.GetEnvironmentVariable("GYM_API");

            var baseUri = new Uri(api);
            var uri = new Uri(baseUri, baseUri.LocalPath.TrimEnd('/') + $"/user/{userId}");

            var response = await _http.GetStringAsync(uri);

            return new OkObjectResult(response);
        }
    }
}
