using System.Threading.Tasks;

using Azure.AI.OpenAI;

using Domain;

namespace GenerativeAi.Functions.ingestion;

public class TextAda002Embedding : Embed
{
    private const string modelId = "text-embedding-ada-002";
    private readonly OpenAIClient _openAiClient;

    public TextAda002Embedding(OpenAIClient openAiClient)
    {
        _openAiClient = openAiClient;
    }

    public async Task<Embedding> Embedding(string content)
    {
        var result = await _openAiClient.GetEmbeddingsAsync(modelId, new EmbeddingsOptions(content));
        return new Embedding(result.Value.Data[0].Embedding);
    }
}