using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoard.API.Controllers;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.DTOs.Auth;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.Tests.Controllers;

[TestFixture]
public class AuthControllerTests
{
    private Mock<IAuthService> _authServiceMock;
    private AuthController _controller;

    [SetUp]
    public void Setup()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Test]
    public async Task Register_ReturnsOkWithUserInfo()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            FullName = "Test", Email = "test@test.com",
            Password = "Test@1234", ConfirmPassword = "Test@1234"
        };
        var response = new AuthResponseDto
        {
            UserId = Guid.NewGuid(),
            FullName = "Test",
            Email = "test@test.com"
        };
        _authServiceMock.Setup(s => s.RegisterAsync(request)).ReturnsAsync(response);

        // Act
        var result = await _controller.Register(request);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var apiResponse = okResult.Value.Should().BeOfType<ApiResponse<AuthResponseDto>>().Subject;
        apiResponse.Success.Should().BeTrue();
        apiResponse.Data!.Email.Should().Be("test@test.com");
    }

    [Test]
    public async Task Login_ReturnsOkWithUserInfo()
    {
        // Arrange
        var request = new LoginRequestDto { Email = "test@test.com", Password = "Test@1234" };
        var response = new AuthResponseDto
        {
            UserId = Guid.NewGuid(),
            FullName = "Test",
            Email = "test@test.com"
        };
        _authServiceMock.Setup(s => s.LoginAsync(request)).ReturnsAsync(response);

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var apiResponse = okResult.Value.Should().BeOfType<ApiResponse<AuthResponseDto>>().Subject;
        apiResponse.Success.Should().BeTrue();
    }

    [Test]
    public async Task Logout_ReturnsOk()
    {
        // Arrange
        _authServiceMock.Setup(s => s.LogoutAsync()).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Logout();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        _authServiceMock.Verify(s => s.LogoutAsync(), Times.Once);
    }
}
