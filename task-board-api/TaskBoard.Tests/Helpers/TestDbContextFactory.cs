using Microsoft.EntityFrameworkCore;
using TaskBoard.Infrastructure.Data;

namespace TaskBoard.Tests.Helpers;

/// <summary>
/// Factory for creating in-memory AppDbContext instances for repository integration tests.
/// </summary>
public static class TestDbContextFactory
{
    public static AppDbContext Create()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }
}
