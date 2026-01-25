using Domain;

using StackExchange.Redis;

namespace Redis;

public class RedisFactory
{
    private readonly IDatabase _database;
    private readonly Settings _settings;

    public RedisFactory(Settings settings)
    {
        _settings = settings;
        _database = Database();
    }

    private IDatabase Database()
    {
        var redis = ConnectionMultiplexer.Connect(_settings.ConnectionString);
        return redis.GetDatabase(_settings.Database);
    }

    public Documents Documents() => new RedisDocuments(_database);

    public Task CreateIndex() => new RedisDocuments(_database).CreateIndex();
}