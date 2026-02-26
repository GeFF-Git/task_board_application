using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoard.API.Controllers;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.DTOs.Columns;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.Tests.Controllers;

[TestFixture]
public class ColumnsControllerTests
{
    private Mock<IColumnService> _columnServiceMock;
    private ColumnsController _controller;

    [SetUp]
    public void Setup()
    {
        _columnServiceMock = new Mock<IColumnService>();
        _controller = new ColumnsController(_columnServiceMock.Object);
    }

    [Test]
    public async Task GetAll_ReturnsOkWithColumns()
    {
        // Arrange
        var columns = new List<ColumnDto>
        {
            new() { Id = Guid.NewGuid(), Name = "Backlog", Order = 0, TaskCount = 3 }
        };
        _columnServiceMock.Setup(s => s.GetAllAsync()).ReturnsAsync(columns);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var apiResponse = okResult.Value.Should().BeOfType<ApiResponse<List<ColumnDto>>>().Subject;
        apiResponse.Data.Should().HaveCount(1);
    }

    [Test]
    public async Task Delete_ReturnsOk()
    {
        // Arrange
        var columnId = Guid.NewGuid();
        _columnServiceMock.Setup(s => s.DeleteAsync(columnId)).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Delete(columnId);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }
}
