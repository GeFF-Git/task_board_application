using FluentAssertions;
using TaskBoard.Core.Entities;
using TaskBoard.Infrastructure.Repositories;
using TaskBoard.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace TaskBoard.Tests.Repositories;

[TestFixture]
public class ColumnRepositoryTests
{
    [Test]
    public async Task GetByUserId_ReturnsOnlyUserColumns()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var user = MockDataBuilder.User().WithId(userId).Build();
        var otherUser = MockDataBuilder.User().WithId(otherUserId).Build();
        context.Users.AddRange(user, otherUser);

        context.Columns.AddRange(
            MockDataBuilder.Column().WithUserId(userId).WithName("Backlog").Build(),
            MockDataBuilder.Column().WithUserId(userId).WithName("Done").Build(),
            MockDataBuilder.Column().WithUserId(otherUserId).WithName("Other").Build()
        );
        await context.SaveChangesAsync();

        var repo = new ColumnRepository(context);

        // Act
        var columns = await repo.GetByUserId(userId).ToListAsync();

        // Assert
        columns.Should().HaveCount(2);
        columns.Should().AllSatisfy(c => c.UserId.Should().Be(userId));
    }

    [Test]
    public async Task GetMaxOrderAsync_ReturnsCorrectMaxOrder()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userId = Guid.NewGuid();
        var user = MockDataBuilder.User().WithId(userId).Build();
        context.Users.Add(user);

        context.Columns.AddRange(
            MockDataBuilder.Column().WithUserId(userId).WithOrder(0).Build(),
            MockDataBuilder.Column().WithUserId(userId).WithOrder(1).Build(),
            MockDataBuilder.Column().WithUserId(userId).WithOrder(3).Build()
        );
        await context.SaveChangesAsync();

        var repo = new ColumnRepository(context);

        // Act
        var max = await repo.GetMaxOrderAsync(userId);

        // Assert
        max.Should().Be(3);
    }

    [Test]
    public async Task GetMaxOrderAsync_NoColumns_ReturnsNegativeOne()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userId = Guid.NewGuid();
        var repo = new ColumnRepository(context);

        // Act
        var max = await repo.GetMaxOrderAsync(userId);

        // Assert
        max.Should().Be(-1);
    }
}
