namespace Domain;

public record Embedding(IReadOnlyList<float> Vectors)
{
    public byte[] AsBytes()
    {
        var vectorBytes = new byte[Vectors.Count * sizeof(float)];
        Buffer.BlockCopy(Vectors.ToArray(), 0, vectorBytes, 0, vectorBytes.Length);
        return vectorBytes;
    }
}