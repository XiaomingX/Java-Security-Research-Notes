using System.Threading.Tasks;

using Domain;

using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;

namespace GenerativeAi.Functions.ingestion;

public class ProcessFunction
{
    private readonly Documents _documents;
    private readonly Embed _embed;

    public ProcessFunction(Embed embed,
                           Documents documents)
    {
        _embed = embed;
        _documents = documents;
    }

    [FunctionName(nameof(ProcessChunk))]
    public async Task ProcessChunk([ActivityTrigger] Chunk chunk)
    {
        var embeddings = await _embed.Embedding(chunk.Content);
        await _documents.Save(chunk, embeddings);
    }
}