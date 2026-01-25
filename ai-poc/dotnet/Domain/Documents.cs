namespace Domain;

public interface Documents
{
    Task Save(Chunk chunk, Embedding embedding);
    Task<IReadOnlyList<SearchResult>> Search(Embedding embedding);
}