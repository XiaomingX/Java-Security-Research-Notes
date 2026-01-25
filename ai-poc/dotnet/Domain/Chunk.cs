namespace Domain;

public record Chunk(ChunkId Id,
                    Document Document,
                    string Content);