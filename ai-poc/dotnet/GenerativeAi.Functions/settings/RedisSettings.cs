using Redis;

namespace GenerativeAi.Functions.settings;

public class RedisSettings
{
    public int Database { get; set; }
    public string ConnectionString { get; set; }

    public Settings AsSettings()
        => new(ConnectionString, Database);
}