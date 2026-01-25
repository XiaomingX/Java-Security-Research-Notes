using System;

namespace GenerativeAi.Functions.settings;

public class AzureCognativeSearchSettings
{
    public Uri Endpoint { get; set; }
    public string Key { get; set; }

    public CognitiveSearch.Settings AsSettings() => new(Endpoint, Key);
}