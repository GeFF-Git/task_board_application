using System.Security.Claims;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using TaskBoard.Core.DTOs.Tasks;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Enums;
using TaskBoard.Core.Exceptions;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Infrastructure.Mappings;
using TaskBoard.Infrastructure.Services;
using TaskBoard.Tests.Helpers;

namespace TaskBoard.Tests.Services;

[TestFixture]
public class TaskServiceTests
{
    private Mock<ITaskRepository> _taskRepoMock;
    private Mock<IColumnRepository> _columnRepoMock;
    private IMapper _mapper;
    private Mock<IHttpContextAccessor> _httpContextMock;
    private TaskService _taskService;
    private Guid _currentUserId;

    [SetUp]
    public void Setup()
    {
        _taskRepoMock = new Mock<ITaskRepository>();
        _columnRepoMock = new Mock<IColumnRepository>();
        _currentUserId = Guid.NewGuid();

        var config = new MapperConfiguration(cfg => cfg.AddProfile<TaskProfile>());
        _mapper = config.CreateMapper();

        _httpContextMock = new Mock<IHttpContextAccessor>();
        var httpContext = new DefaultHttpContext();
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, _currentUserId.ToString())
        }, "test"));
        _httpContextMock.Setup(x => x.HttpContext).Returns(httpContext);

        _taskService = new TaskService(
            _taskRepoMock.Object, _columnRepoMock.Object, _mapper, _httpContextMock.Object);
    }

    [Test]
    public async Task GetByIdAsync_HappyPath_ReturnsTask()
    {
        // Arrange
        var columnId = Guid.NewGuid();
        var column = MockDataBuilder.Column().WithId(columnId).WithName("Backlog").WithUserId(_currentUserId).Build();
        var task = MockDataBuilder.TaskItem()
            .WithUserId(_currentUserId).WithColumnId(columnId).WithTitle("My Task").Build();
        task.Column = column;
        _taskRepoMock.Setup(r => r.GetByIdAsync(task.Id)).ReturnsAsync(task);

        // Act
        var result = await _taskService.GetByIdAsync(task.Id);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("My Task");
    }

    [Test]
    public async Task GetByIdAsync_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        _taskRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((TaskItem?)null);

        // Act
        var act = () => _taskService.GetByIdAsync(Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Test]
    public async Task GetByIdAsync_DifferentUser_ThrowsUnauthorized()
    {
        // Arrange
        var task = MockDataBuilder.TaskItem()
            .WithUserId(Guid.NewGuid()) // Different user
            .Build();
        _taskRepoMock.Setup(r => r.GetByIdAsync(task.Id)).ReturnsAsync(task);

        // Act
        var act = () => _taskService.GetByIdAsync(task.Id);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
    }

    [Test]
    public async Task CreateAsync_HappyPath_ReturnsCreatedTask()
    {
        // Arrange
        var columnId = Guid.NewGuid();
        var column = MockDataBuilder.Column().WithId(columnId).WithUserId(_currentUserId).Build();
        _columnRepoMock.Setup(r => r.GetByIdAsync(columnId)).ReturnsAsync(column);
        _taskRepoMock.Setup(r => r.AddAsync(It.IsAny<TaskItem>())).ReturnsAsync((TaskItem t) => { t.Column = column; return t; });

        var dto = new CreateTaskDto
        {
            Title = "New Task",
            Priority = "urgent",
            ColumnId = columnId,
            Category = "Test"
        };

        // Act
        var result = await _taskService.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("New Task");
        result.Priority.Should().Be("urgent");
    }

    [Test]
    public async Task DeleteAsync_HappyPath_DeletesTask()
    {
        // Arrange
        var task = MockDataBuilder.TaskItem().WithUserId(_currentUserId).Build();
        _taskRepoMock.Setup(r => r.GetByIdAsync(task.Id)).ReturnsAsync(task);

        // Act
        await _taskService.DeleteAsync(task.Id);

        // Assert
        _taskRepoMock.Verify(r => r.DeleteAsync(task.Id), Times.Once);
    }

    [Test]
    public async Task DeleteAsync_DifferentUser_ThrowsUnauthorized()
    {
        // Arrange
        var task = MockDataBuilder.TaskItem().WithUserId(Guid.NewGuid()).Build();
        _taskRepoMock.Setup(r => r.GetByIdAsync(task.Id)).ReturnsAsync(task);

        // Act
        var act = () => _taskService.DeleteAsync(task.Id);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
    }

    [Test]
    public async Task MoveAsync_HappyPath_MovesTask()
    {
        // Arrange
        var oldColumnId = Guid.NewGuid();
        var newColumnId = Guid.NewGuid();
        var column = MockDataBuilder.Column().WithId(oldColumnId).WithName("Backlog").WithUserId(_currentUserId).Build();
        var task = MockDataBuilder.TaskItem().WithUserId(_currentUserId).WithColumnId(oldColumnId).Build();
        task.Column = column;
        var newColumn = MockDataBuilder.Column().WithId(newColumnId).WithName("Done").WithUserId(_currentUserId).Build();

        _taskRepoMock.Setup(r => r.GetByIdAsync(task.Id)).ReturnsAsync(task);
        _columnRepoMock.Setup(r => r.GetByIdAsync(newColumnId)).ReturnsAsync(newColumn);

        // Act
        var result = await _taskService.MoveAsync(task.Id, new MoveTaskDto { ColumnId = newColumnId });

        // Assert
        result.ColumnId.Should().Be(newColumnId);
        _taskRepoMock.Verify(r => r.UpdateAsync(It.IsAny<TaskItem>()), Times.Once);
    }
}
