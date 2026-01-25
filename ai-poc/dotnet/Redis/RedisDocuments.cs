using Domain;

using NRedisStack;
using NRedisStack.RedisStackCommands;
using NRedisStack.Search;
using NRedisStack.Search.Literals.Enums;

using StackExchange.Redis;

using Document=NRedisStack.Search.Document;

namespace Redis;

internal class RedisDocuments : Documents
{
    private const string IndexName = "documentIndex";
    private const string IndexPrefix = "document";
    private readonly IDatabase _database;

    public RedisDocuments(IDatabase database)
    {
        _database = database;
    }

    public Task CreateIndex()
    {
        ISearchCommands ft = _database.FT();
        ft.Create(IndexName,
                  new FTCreateParams().On(IndexDataType.HASH)
                                      .Prefix($"{IndexPrefix}:"),
                  new Schema().AddVectorField("embedding",
                                              Schema.VectorField.VectorAlgo.HNSW,
                                              new Dictionary<string, object>
                                              {
                                                  {"TYPE", "FLOAT32"},
                                                  {"DIM", 1536},
                                                  {"DISTANCE_METRIC", "COSINE"}
                                              })
                              .AddTextField("name")
                              .AddTextField("version")
                              .AddTextField("chunkId"));
        return Task.CompletedTask;
    }

    public Task Save(Chunk chunk,
                     Embedding embedding)
        => _database.HashSetAsync($"{IndexPrefix}:{chunk.Document.Name}_{chunk.Document.Version}_{chunk.Id}",
                                  new HashEntry[]
                                  {
                                      new("name", chunk.Document.Name.ToString()),
                                      new("version", chunk.Document.Version.ToString()),
                                      new("chunkId", chunk.Id.ToString()),
                                      new("content", chunk.Content),
                                      new("embedding", embedding.AsBytes())
                                  });

    public Task<IReadOnlyList<Domain.SearchResult>> Search(Embedding embedding)
    {
        ISearchCommands searchCommands = _database.FT();
        var searchResult = searchCommands.Search(IndexName,
                                                 new Query("*=>[KNN $top @embedding $embedding AS score]")
                                                     .AddParam("embedding", embedding.AsBytes())
                                                     .AddParam("top", 5)
                                                     .ReturnFields("name",
                                                                   "version",
                                                                   "content",
                                                                   "chunkId",
                                                                   "score")
                                                     .Dialect(2));
        var results = searchResult.Documents
                                  .Select(AsSearchResult)
                                  .ToList();
        return Task.FromResult<IReadOnlyList<Domain.SearchResult>>(results);

        static Domain.SearchResult AsSearchResult(Document document)
            => new(new FileName(document["name"].ToString()),
                   new Domain.Version(document["version"].ToString()),
                   new ChunkId(document["chunkId"].ToString()),
                   document["content"].ToString(),
                   float.Parse(document["score"].ToString()));
    }
}