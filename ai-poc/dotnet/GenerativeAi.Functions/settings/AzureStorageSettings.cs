using System;

namespace GenerativeAi.Functions.settings;

public class AzureStorageSettings
{
    public string Name { get; set; }
    public string Key { get; set; }
    public string ConnectionString => $"DefaultEndpointsProtocol=https;AccountName={Name};AccountKey={Key}";
}