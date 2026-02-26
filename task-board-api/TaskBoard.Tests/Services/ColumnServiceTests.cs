using System.Security.Claims;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using TaskBoard.Core.DTOs.Columns;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Exceptions;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Infrastructure.Mappings;
using TaskBoard.Infrastructure.Services;
using TaskBoard.Tests.Helpers;

namespace TaskBoard.Tests.Services;

[TestFixture]
public class ColumnServiceTests
{
    private Mock<IColumnRepository> _columnRepoMock;
    private Mock<ITaskRepository> _taskRepoMock;
    private IMapper _mapper;
    private Mock<IHttpContextAccessor> _httpContextMock;
    private ColumnService _columnService;
    private Guid _currentUserId;

    [SetUp]
    public void Setup()
    {
        _columnRepoMock = new Mock<IColumnRepository>();
        _taskRepoMock = new Mock<ITaskRepository>();
        _currentUserId = Guid.NewGuid();

        var config = new MapperConfiguration(cfg => cfg.AddProfile<ColumnProfile>());
        _mapper = config.CreateMapper();

        _httpContextMock = new Mock<IHttpContextAccessor>();
        var httpContext = new DefaultHttpContext();
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, _currentUserId.ToString())
        }, "test"));
        _httpContextMock.Setup(x => x.HttpContext).Returns(httpContext);

        _columnService = new ColumnService(
            _columnRepoMock.Object, _taskRepoMock.Object, _mapper, _httpContextMock.Object);
    }

    [Test]
    public async Task CreateAsync_HappyPath_ReturnsNewColumn()
    {
        // Arrange
        _columnRepoMock.Setup(r => r.GetMaxOrderAsync(_currentUserId)).ReturnsAsync(3);
        _columnRepoMock.Setup(r => r.AddAsync(It.IsAny<Column>())).ReturnsAsync((Column c) => c);

        var dto = new CreateColumnDto { Name = "Review" };

        // Act
        var result = await _columnService.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Review");
        result.Order.Should().Be(4);
        result.TaskCount.Should().Be(0);
    }

    [Test]
    public async Task DeleteAsync_WithTasks_ThrowsValidationException()
    {
        // Arrange
        var columnId = Guid.NewGuid();
        var column = MockDataBuilder.Column().WithId(columnId).WithUserId(_currentUserId).WithName("Busy").Build();
        _columnRepoMock.Setup(r => r.GetByIdAsync(columnId)).ReturnsAsync(column);
        _taskRepoMock.Setup(r => r.GetCountByColumnAsync(columnId, _currentUserId)).ReturnsAsync(5);

        // Act
        var act = () => _columnService.DeleteAsync(columnId);

        // Assert
        await act.Should().ThrowAsync<Core.Exceptions.ValidationException>()
            .WithMessage("*validation*");
    }

    [Test]
    public async Task DeleteAsync_EmptyColumn_Succeeds()
    {
        // Arrange
        var columnId = Guid.NewGuid();
        var column = MockDataBuilder.Column().WithId(columnId).WithUserId(_currentUserId).Build();
        _columnRepoMock.Setup(r => r.GetByIdAsync(columnId)).ReturnsAsync(column);
        _taskRepoMock.Setup(r => r.GetCountByColumnAsync(columnId, _currentUserId)).ReturnsAsync(0);

        // Act
        await _columnService.DeleteAsync(columnId);

        // Assert
        _columnRepoMock.Verify(r => r.DeleteAsync(columnId), Times.Once);
    }

    [Test]
    public async Task DeleteAsync_DifferentUser_ThrowsUnauthorized()
    {
        // Arrange
        var columnId = Guid.NewGuid();
        var column = MockDataBuilder.Column().WithId(columnId).WithUserId(Guid.NewGuid()).Build();
        _columnRepoMock.Setup(r => r.GetByIdAsync(columnId)).ReturnsAsync(column);

        // Act
        var act = () => _columnService.DeleteAsync(columnId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
    }

    [Test]
    public async Task UpdateAsync_NotFound_ThrowsNotFoundException()
    {
        // Arrange
        _columnRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Column?)null);

        // Act
        var act = () => _columnService.UpdateAsync(Guid.NewGuid(), new UpdateColumnDto { Name = "Test" });

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
