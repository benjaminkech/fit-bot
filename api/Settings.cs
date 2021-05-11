using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace FitBot.Settings
{
    public static class Settings
    {
        [FunctionName("Settings")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string migrosApi = await GetEnvironmentVariable("MIGROS_API");
            string triggerApi = await GetEnvironmentVariable("TRIGGER_API");

            var myObj = new { migrosApi, triggerApi };
     
            return new OkObjectResult(myObj);
        }
        public static Task<string> GetEnvironmentVariable(string name) 
        {
            return Task.FromResult(System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process));
        }
    }
}
