using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure.Storage.Blobs;

using Domain;

using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;

namespace GenerativeAi.Functions.ingestion;

public class AnalyzeFunction
{
    private const string ContainerName = "ingestion-documents";
    private readonly BlobServiceClient _blobServiceClient;
    private readonly DocumentAnalysisClient _documentAnalysisClient;
    private readonly ModelSelector _modelSelector;

    public AnalyzeFunction(DocumentAnalysisClient documentAnalysisClient,
                           BlobServiceClient blobServiceClient,
                           ModelSelector modelSelector)
    {
        _documentAnalysisClient = documentAnalysisClient;
        _blobServiceClient = blobServiceClient;
        _modelSelector = modelSelector;
    }

    [FunctionName(nameof(AnalyzeDocument))]
    public async Task<IEnumerable<Chunk>> AnalyzeDocument([ActivityTrigger] AnalyzeDocumentRequest request)
    {
        var stream = await RetrieveBlob(request.FileName);
        var version = await GetFileVersion(stream);
        var document = new Document(request.FileName, version);
        var result = await _documentAnalysisClient.AnalyzeDocumentAsync(WaitUntil.Completed,
                                                                        _modelSelector.ModelFrom(request.Type),
                                                                        stream);
        await stream.DisposeAsync();

        //a clean way to change chunk strategy is needed
        return result.Value.Pages.Select(page => new Chunk(new ChunkId(page.PageNumber.ToString()),
                                                           document,
                                                           string.Join(" ", page.Lines.Select(l => l.Content))));
    }

    private static async Task<Version> GetFileVersion(Stream stream)
    {
        var hash = await SHA256.Create().ComputeHashAsync(stream);
        stream.Position = 0;
        return new Version(string.Concat(hash.Select(b => b.ToString("x2"))));
    }

    private async Task<Stream> RetrieveBlob(FileName name)
    {
        var blobContainerClient = _blobServiceClient.GetBlobContainerClient(ContainerName);
        var blobClient = blobContainerClient.GetBlobClient(name.Value);

        var stream = new MemoryStream();
        await blobClient.DownloadToAsync(stream);
        stream.Position = 0;

        return stream;
    }

    public record AnalyzeDocumentRequest(FileName FileName, string Type);
}