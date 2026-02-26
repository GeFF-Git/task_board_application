using TaskBoard.Core.Entities;
using TaskBoard.Core.Enums;

namespace TaskBoard.Tests.Helpers;

/// <summary>
/// Fluent builder for creating test entities with sensible defaults.
/// </summary>
public class MockDataBuilder
{
    public static UserBuilder User() => new();
    public static ColumnBuilder Column() => new();
    public static TaskItemBuilder TaskItem() => new();
}

public class UserBuilder
{
    private readonly User _user = new()
    {
        Id = Guid.NewGuid(),
        Email = $"test-{Guid.NewGuid():N}@example.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
        FullName = "Test User"
    };

    public UserBuilder WithId(Guid id) { _user.Id = id; return this; }
    public UserBuilder WithEmail(string email) { _user.Email = email; return this; }
    public UserBuilder WithFullName(string name) { _user.FullName = name; return this; }
    public UserBuilder WithPasswordHash(string hash) { _user.PasswordHash = hash; return this; }
    public User Build() => _user;
}

public class ColumnBuilder
{
    private readonly Column _column = new()
    {
        Id = Guid.NewGuid(),
        Name = "Test Column",
        Order = 0,
        UserId = Guid.NewGuid(),
        IsDefault = false
    };

    public ColumnBuilder WithId(Guid id) { _column.Id = id; return this; }
    public ColumnBuilder WithName(string name) { _column.Name = name; return this; }
    public ColumnBuilder WithOrder(int order) { _column.Order = order; return this; }
    public ColumnBuilder WithUserId(Guid userId) { _column.UserId = userId; return this; }
    public ColumnBuilder WithIsDefault(bool isDefault) { _column.IsDefault = isDefault; return this; }
    public Column Build() => _column;
}

public class TaskItemBuilder
{
    private readonly TaskItem _task = new()
    {
        Id = Guid.NewGuid(),
        Title = "Test Task",
        Description = "Test Description",
        Priority = Priority.Normal,
        ColumnId = Guid.NewGuid(),
        UserId = Guid.NewGuid(),
        Category = "General",
        ExternalId = "MDS-01",
        DueDate = DateTime.UtcNow.AddDays(7)
    };

    public TaskItemBuilder WithId(Guid id) { _task.Id = id; return this; }
    public TaskItemBuilder WithTitle(string title) { _task.Title = title; return this; }
    public TaskItemBuilder WithDescription(string desc) { _task.Description = desc; return this; }
    public TaskItemBuilder WithPriority(Priority p) { _task.Priority = p; return this; }
    public TaskItemBuilder WithColumnId(Guid columnId) { _task.ColumnId = columnId; return this; }
    public TaskItemBuilder WithUserId(Guid userId) { _task.UserId = userId; return this; }
    public TaskItemBuilder WithCategory(string cat) { _task.Category = cat; return this; }
    public TaskItemBuilder WithExternalId(string externalId) { _task.ExternalId = externalId; return this; }
    public TaskItemBuilder WithDueDate(DateTime? dueDate) { _task.DueDate = dueDate; return this; }
    public TaskItemBuilder WithIsDeleted(bool deleted) { _task.IsDeleted = deleted; _task.DeletedAt = deleted ? DateTime.UtcNow : null; return this; }
    public TaskItem Build() => _task;
}
