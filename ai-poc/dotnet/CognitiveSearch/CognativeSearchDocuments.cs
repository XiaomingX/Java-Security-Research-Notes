using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Azure.Search.Documents.Models;

using Domain;

using Version=Domain.Version;

namespace CognitiveSearch
{
    internal class CognativeSearchDocuments : Documents
    {
        private const string IndexName = "documents";
        private readonly SearchIndexClient _client;
        private readonly SearchClient _searchClient;

        public CognativeSearchDocuments(SearchIndexClient client)
        {
            _client = client;
            _searchClient = _client.GetSearchClient(IndexName);
        }

        public Task Save(Chunk chunk, Embedding embedding)
            => _searchClient.IndexDocumentsAsync(IndexDocumentsBatch.Upload(new List<Document> {new(chunk, embedding)}));

        public async Task<IReadOnlyList<SearchResult>> Search(Embedding embedding)
        {
            var vector = new SearchQueryVector
                         {
                             K = 5,
                             Fields = "Embedding",
                             Value = embedding.Vectors.ToArray()
                         };
            var searchOptions = new SearchOptions
                                {
                                    Vector = vector,
                                    Size = 5,
                                    Select =
                                    {
                                        "Name",
                                        "Version",
                                        "Content",
                                        "ChunkId"
                                    },
                                };
            SearchResults<SearchDocument> response = await _searchClient.SearchAsync<SearchDocument>(null, searchOptions);
            return await response.GetResultsAsync().Select(AsSearchResult)
                                 .ToListAsync();

            static SearchResult AsSearchResult(SearchResult<SearchDocument> result)
                => new(new FileName(result.Document["Name"].ToString()),
                       new Version(result.Document["Version"].ToString()),
                       new ChunkId(result.Document["ChunkId"].ToString()),
                       result.Document["Content"].ToString(),
                       result.Score.HasValue ? (float) result.Score.Value : 0);
        }

        public Task CreateIndex()
        {
            var index = new SearchIndex(IndexName)
                        {
                            VectorSearch = new VectorSearch {AlgorithmConfigurations = {new VectorSearchAlgorithmConfiguration("VectorSearchConfiguration", "hnsw")}},
                            SemanticSettings = new SemanticSettings
                                               {
                                                   Configurations =
                                                   {
                                                       new SemanticConfiguration("SemanticSearchConfiguration",
                                                                                 new PrioritizedFields
                                                                                 {
                                                                                     TitleField = new SemanticField {FieldName = "Name"},
                                                                                     ContentFields = {new SemanticField {FieldName = "Content"}},
                                                                                     KeywordFields = {new SemanticField {FieldName = "Version"}}
                                                                                 })
                                                   },
                                               },
                            Fields =
                            {
                                new SearchableField("Name")
                                {
                                    IsFilterable = true,
                                    IsSortable = true,
                                    IsFacetable = true
                                },
                                new SearchableField("Version")
                                {
                                    IsFilterable = true,
                                    IsSortable = true,
                                    IsFacetable = true
                                },
                                new SimpleField("ChunkId", SearchFieldDataType.String)
                                {
                                    IsFilterable = true,
                                    IsKey = true,
                                },
                                new SearchField("Embedding", SearchFieldDataType.Collection(SearchFieldDataType.Single))
                                {
                                    IsSearchable = true,
                                    Dimensions = 1536,
                                    VectorSearchConfiguration = "VectorSearchConfiguration"
                                },
                                new SearchableField("Content") {IsFilterable = true}
                            }
                        };
            return _client.CreateOrUpdateIndexAsync(index);
        }

        private class Document
        {
            public Document(Chunk chunk, Embedding embedding)
            {
                Name = chunk.Document.Name.Value;
                Version = chunk.Document.Version.Value;
                Content = chunk.Content;
                ChunkId = chunk.Id.Value;
                Embedding = embedding.Vectors.ToArray();
            }

            public string Name { get; set; }
            public string Version { get; set; }
            public string Content { get; set; }
            public string ChunkId { get; set; }
            public float[] Embedding { get; set; }
        }
    }
}