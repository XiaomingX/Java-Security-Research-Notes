using Azure;
using Azure.Search.Documents.Indexes;

using Domain;

namespace CognitiveSearch;

public class CognativeSearchFactory
{
    private readonly SearchIndexClient _indexClient;

    public CognativeSearchFactory(Settings settings)
    {
        _indexClient = new SearchIndexClient(settings.Endpoint, new AzureKeyCredential(settings.Key));
    }

    public Documents Documents() => new CognativeSearchDocuments(_indexClient);

    public Task CreateIndex() => new CognativeSearchDocuments(_indexClient).CreateIndex();
}