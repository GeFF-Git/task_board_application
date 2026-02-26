using FluentAssertions;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Enums;
using TaskBoard.Infrastructure.Repositories;
using TaskBoard.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace TaskBoard.Tests.Repositories;

[TestFixture]
public class TaskRepositoryTests
{
    [Test]
    public async Task GetByUserId_ReturnsOnlyUserTasks()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var user = MockDataBuilder.User().WithId(userId).Build();
        var otherUser = MockDataBuilder.User().WithId(otherUserId).Build();
        context.Users.AddRange(user, otherUser);

        var column = MockDataBuilder.Column().WithUserId(userId).Build();
        var otherColumn = MockDataBuilder.Column().WithUserId(otherUserId).Build();
        context.Columns.AddRange(column, otherColumn);

        var task1 = MockDataBuilder.TaskItem().WithUserId(userId).WithColumnId(column.Id).WithTitle("User Task").Build();
        var task2 = MockDataBuilder.TaskItem().WithUserId(otherUserId).WithColumnId(otherColumn.Id).WithTitle("Other Task").Build();
        context.Tasks.AddRange(task1, task2);
        await context.SaveChangesAsync();

        var repo = new TaskRepository(context);

        // Act
        var tasks = await repo.GetByUserId(userId).ToListAsync();

        // Assert
        tasks.Should().HaveCount(1);
        tasks[0].Title.Should().Be("User Task");
    }

    [Test]
    public async Task GetByColumnId_ReturnsColumnTasks()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userId = Guid.NewGuid();
        var user = MockDataBuilder.User().WithId(userId).Build();
        context.Users.Add(user);

        var column1 = MockDataBuilder.Column().WithUserId(userId).WithName("Backlog").Build();
        var column2 = MockDataBuilder.Column().WithUserId(userId).WithName("Done").Build();
        context.Columns.AddRange(column1, column2);

        var task1 = MockDataBuilder.TaskItem().WithUserId(userId).WithColumnId(column1.Id).Build();
        var task2 = MockDataBuilder.TaskItem().WithUserId(userId).WithColumnId(column2.Id).Build();
        context.Tasks.AddRange(task1, task2);
        await context.SaveChangesAsync();

        var repo = new TaskRepository(context);

        // Act
        var tasks = await repo.GetByColumnId(column1.Id, userId).ToListAsync();

        // Assert
        tasks.Should().HaveCount(1);
    }

    [Test]
    public async Task GetCountByColumnAsync_ReturnsCorrectCount()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userId = Guid.NewGuid();
        var user = MockDataBuilder.User().WithId(userId).Build();
        context.Users.Add(user);

        var column = MockDataBuilder.Column().WithUserId(userId).Build();
        context.Columns.Add(column);

        for (int i = 0; i < 3; i++)
        {
            context.Tasks.Add(MockDataBuilder.TaskItem().WithUserId(userId).WithColumnId(column.Id).Build());
        }
        await context.SaveChangesAsync();

        var repo = new TaskRepository(context);

        // Act
        var count = await repo.GetCountByColumnAsync(column.Id, userId);

        // Assert
        count.Should().Be(3);
    }

    [Test]
    public async Task SoftDelete_EntityNotReturnedAfterDeletion()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userId = Guid.NewGuid();
        var user = MockDataBuilder.User().WithId(userId).Build();
        context.Users.Add(user);

        var column = MockDataBuilder.Column().WithUserId(userId).Build();
        context.Columns.Add(column);

        var task = MockDataBuilder.TaskItem().WithUserId(userId).WithColumnId(column.Id).Build();
        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var repo = new TaskRepository(context);

        // Act
        await repo.DeleteAsync(task.Id);
        var result = await repo.GetByUserId(userId).ToListAsync();

        // Assert — soft deleted task should not be returned due to global query filter
        result.Should().BeEmpty();
    }
}
