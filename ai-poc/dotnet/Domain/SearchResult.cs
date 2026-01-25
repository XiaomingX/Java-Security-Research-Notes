namespace Domain;

public record SearchResult(FileName Name,
                           Version Version,
                           ChunkId ChunkId,
                           string Content,
                           float Score);