using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoard.API.Controllers;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.DTOs.Tasks;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.Tests.Controllers;

[TestFixture]
public class TasksControllerTests
{
    private Mock<ITaskService> _taskServiceMock;
    private TasksController _controller;

    [SetUp]
    public void Setup()
    {
        _taskServiceMock = new Mock<ITaskService>();
        _controller = new TasksController(_taskServiceMock.Object);
    }

    [Test]
    public async Task GetAll_ReturnsOkWithPaginatedResult()
    {
        // Arrange
        var tasks = new List<TaskDto>
        {
            new() { Id = Guid.NewGuid(), Title = "Task 1", Priority = "normal", Status = "backlog" }
        };
        _taskServiceMock.Setup(s => s.GetAllAsync(null, null, null, null, null, 1, 50)).ReturnsAsync(tasks);
        _taskServiceMock.Setup(s => s.GetTotalCountAsync(null, null, null)).ReturnsAsync(1);

        // Act
        var result = await _controller.GetAll(null, null, null, null, null, 1, 50);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var apiResponse = okResult.Value.Should().BeOfType<PaginatedResponse<TaskDto>>().Subject;
        apiResponse.Success.Should().BeTrue();
        apiResponse.Data.Should().HaveCount(1);
        apiResponse.Total.Should().Be(1);
    }

    [Test]
    public async Task Create_ReturnsCreatedResult()
    {
        // Arrange
        var dto = new CreateTaskDto { Title = "New Task", Priority = "urgent", ColumnId = Guid.NewGuid() };
        var task = new TaskDto { Id = Guid.NewGuid(), Title = "New Task", Priority = "urgent" };
        _taskServiceMock.Setup(s => s.CreateAsync(dto)).ReturnsAsync(task);

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var createdResult = result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var apiResponse = createdResult.Value.Should().BeOfType<ApiResponse<TaskDto>>().Subject;
        apiResponse.Data!.Title.Should().Be("New Task");
    }

    [Test]
    public async Task Delete_ReturnsOk()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        _taskServiceMock.Setup(s => s.DeleteAsync(taskId)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Delete(taskId);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }
}
