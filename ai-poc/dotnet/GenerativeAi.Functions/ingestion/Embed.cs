using System.Threading.Tasks;

using Domain;

namespace GenerativeAi.Functions.ingestion;

public interface Embed
{
    Task<Embedding> Embedding(string content);
}