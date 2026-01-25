namespace GenerativeAi.Functions.ingestion;

public class ModelSelector
{
    private readonly string _defaultModelId;

    public ModelSelector(string defaultModelId)
    {
        _defaultModelId = defaultModelId;
    }

    public string ModelFrom(string type) => type switch
    {
        _ => _defaultModelId
    };
}