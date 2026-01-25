using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

using Azure.AI.OpenAI;

using Domain;

using GenerativeAi.Functions.ingestion;

using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace GenerativeAi.Functions.question;

public class QuestionOrchestration
{
    private readonly Documents _documents;
    private readonly Embed _embed;
    private readonly OpenAIClient _openAiClient;

    public QuestionOrchestration(Embed embed,
                                 Documents documents,
                                 OpenAIClient openAiClient)
    {
        _embed = embed;
        _documents = documents;
        _openAiClient = openAiClient;
    }

    [FunctionName(nameof(Question))]
    public static async Task<HttpResponseMessage> Question([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequestMessage request,
                                                           [DurableClient] IDurableOrchestrationClient orchestrationClient)
    {
        var data = await request.Content.ReadAsAsync<QuestionRequest>();

        var instanceId = await orchestrationClient.StartNewAsync(nameof(QuestionOrchestrator), data);

        return orchestrationClient.CreateCheckStatusResponse(request, instanceId);
    }

    [FunctionName(nameof(QuestionOrchestrator))]
    public async Task<QuestionResponse> QuestionOrchestrator([OrchestrationTrigger] IDurableOrchestrationContext context)
    {
        var request = context.GetInput<QuestionRequest>();

        var embed = await _embed.Embedding(request.Question);
        var results = await _documents.Search(embed);

        var doctorPrompt = new DoctorPrompt();

        var chatResult = await _openAiClient.GetChatCompletionsAsync("gpt-35-turbo",
                                                                     new ChatCompletionsOptions
                                                                     {
                                                                         Temperature = 0,
                                                                         MaxTokens = 1000,
                                                                         Messages =
                                                                         {
                                                                             doctorPrompt.System,
                                                                             doctorPrompt.Question(request.Question, results),
                                                                         }
                                                                     });
        var answer = chatResult.Value.Choices[0].Message.Content;
        return JsonSerializer.Deserialize<QuestionResponse>(answer);
    }

    /*
     * I question the use of orchestrations here.
     * I don't feel it's good design to create a azure function for all the trivial function calls.
     * What I expect a question function will do is:
     *  Create a vector of the question.
     *  Find if this has been asked before:
     *      Yes: return the answer
     *      No: 1. Query the documents for hints.
     *          2. Construct Prompt
     *          3. Ask OpenAI for answer
     *          4. Store the answer
     *          5. Return the answer.
     */
    public record QuestionResponse(string Answer,
                                   string RelevantSubstring,
                                   IEnumerable<QuestionResponseSource> Sources);

    public record QuestionResponseSource(ChunkId ChunkId, int ImportanceRating);
}