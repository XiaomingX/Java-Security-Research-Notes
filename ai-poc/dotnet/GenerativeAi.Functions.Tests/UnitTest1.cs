using Azure.Storage.Blobs;

using GenerativeAi.Functions.ingestion;

using Microsoft.Extensions.Hosting;

namespace GenerativeAi.Functions.Tests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        var x = new BlobServiceClient("UseDevelopmentStorage=true");

        var startup = new Startup();
        var host = new HostBuilder()
                   .ConfigureWebJobs(startup.Configure)
                   .Build();
    }
}