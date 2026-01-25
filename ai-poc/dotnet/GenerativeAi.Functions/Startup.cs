using System.Threading.Tasks;

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure.AI.OpenAI;
using Azure.Storage.Blobs;

using CognitiveSearch;

using GenerativeAi.Functions;
using GenerativeAi.Functions.ingestion;
using GenerativeAi.Functions.settings;

using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Redis;

[assembly:FunctionsStartup(typeof(Startup))]

namespace GenerativeAi.Functions;

public class Startup : FunctionsStartup
{
    private readonly bool _useRedis = false;

    public override void Configure(IFunctionsHostBuilder builder)
    {
        var configuration = new ConfigurationBuilder().SetBasePath(builder.GetContext().ApplicationRootPath)
                                                      .AddJsonFile("appsettings.json", optional:false, reloadOnChange:true)
                                                      .AddJsonFile($"appsettings.{builder.GetContext().EnvironmentName}.json", optional:true, reloadOnChange:true)
                                                      .AddEnvironmentVariables()
                                                      .AddUserSecrets<Startup>()
                                                      .Build();
        builder.Services.AddSingleton<IConfiguration>(configuration);
        builder.Services.AddSingleton(_ =>
                                      {
                                          var settings = configuration.GetSection(nameof(AzureCognativeServicesSettings))
                                                                      .Get<AzureCognativeServicesSettings>();
                                          return new DocumentAnalysisClient(settings.EndPoint, new AzureKeyCredential(settings.Key));
                                      });
        builder.Services.AddSingleton(_ =>
                                      {
                                          var settings = configuration.GetSection(nameof(AzureOpenAiSettings))
                                                                      .Get<AzureOpenAiSettings>();
                                          return new OpenAIClient(settings.EndPoint, new AzureKeyCredential(settings.Key));
                                      });
        builder.Services.AddSingleton(_ =>
                                      {
                                          var settings = configuration.GetSection(nameof(AzureStorageSettings))
                                                                      .Get<AzureStorageSettings>();
                                          return new BlobServiceClient(settings.ConnectionString);
                                      });

        if(_useRedis)
        {
            var redisFactory = new RedisFactory(configuration.GetSection(nameof(RedisSettings))
                                                             .Get<RedisSettings>()
                                                             .AsSettings());
            Task.Run(() => redisFactory.CreateIndex()).GetAwaiter().GetResult();
            builder.Services.AddSingleton(_ => redisFactory.Documents());
        }
        else
        {
            var cognativeSearch = new CognativeSearchFactory(configuration.GetSection(nameof(AzureCognativeSearchSettings))
                                                                          .Get<AzureCognativeSearchSettings>()
                                                                          .AsSettings());
            Task.Run(() => cognativeSearch.CreateIndex()).GetAwaiter().GetResult();
            builder.Services.AddSingleton(_ => cognativeSearch.Documents());
        }

        builder.Services.AddSingleton<Embed, TextAda002Embedding>();
        builder.Services.AddSingleton(_ => new ModelSelector("prebuilt-document"));
    }
}