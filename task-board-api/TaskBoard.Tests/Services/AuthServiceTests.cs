using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Moq;
using TaskBoard.Core.DTOs.Auth;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Exceptions;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Infrastructure.Services;
using TaskBoard.Infrastructure.Settings;
using TaskBoard.Tests.Helpers;

namespace TaskBoard.Tests.Services;

[TestFixture]
public class AuthServiceTests
{
    private Mock<IUserRepository> _userRepoMock;
    private Mock<IColumnRepository> _columnRepoMock;
    private Mock<IHttpContextAccessor> _httpContextMock;
    private Mock<IWebHostEnvironment> _envMock;
    private IOptions<JwtSettings> _jwtSettings;
    private AuthService _authService;
    private DefaultHttpContext _httpContext;

    [SetUp]
    public void Setup()
    {
        _userRepoMock = new Mock<IUserRepository>();
        _columnRepoMock = new Mock<IColumnRepository>();

        // Set up a real HttpContext so cookies can be written
        _httpContext = new DefaultHttpContext();
        _httpContextMock = new Mock<IHttpContextAccessor>();
        _httpContextMock.Setup(x => x.HttpContext).Returns(_httpContext);

        _envMock = new Mock<IWebHostEnvironment>();
        _envMock.Setup(e => e.EnvironmentName).Returns(Environments.Development);

        _jwtSettings = Options.Create(new JwtSettings
        {
            SecretKey = "TestSecretKeyForUnitTestsMustBeAtLeast32CharsLong!!",
            Issuer = "TestIssuer",
            Audience = "TestAudience",
            AccessTokenExpiryMinutes = 60,
            RememberMeExpiryDays = 7,
            CookieName = "taskboard_auth"
        });

        _authService = new AuthService(
            _userRepoMock.Object,
            _columnRepoMock.Object,
            _httpContextMock.Object,
            _envMock.Object,
            _jwtSettings);
    }

    [Test]
    public async Task RegisterAsync_HappyPath_ReturnsUserInfoAndSetsCookie()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            FullName = "Test User",
            Email = "test@example.com",
            Password = "Test@1234",
            ConfirmPassword = "Test@1234"
        };
        _userRepoMock.Setup(r => r.EmailExistsAsync(request.Email)).ReturnsAsync(false);
        _userRepoMock.Setup(r => r.AddAsync(It.IsAny<User>())).ReturnsAsync((User u) => u);
        _columnRepoMock.Setup(r => r.AddAsync(It.IsAny<Column>())).ReturnsAsync((Column c) => c);

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be("test@example.com");
        result.FullName.Should().Be("Test User");
        result.UserId.Should().NotBeEmpty();

        // Verify HttpOnly cookie was set on response
        _httpContext.Response.Headers["Set-Cookie"].ToString().Should().Contain("taskboard_auth");

        // Verify 4 default columns were seeded
        _columnRepoMock.Verify(r => r.AddAsync(It.IsAny<Column>()), Times.Exactly(4));
    }

    [Test]
    public async Task RegisterAsync_DuplicateEmail_ThrowsValidationException()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            FullName = "Test",
            Email = "existing@example.com",
            Password = "Test@1234",
            ConfirmPassword = "Test@1234"
        };
        _userRepoMock.Setup(r => r.EmailExistsAsync(request.Email)).ReturnsAsync(true);

        // Act
        var act = () => _authService.RegisterAsync(request);

        // Assert
        await act.Should().ThrowAsync<Core.Exceptions.ValidationException>()
            .WithMessage("*validation*");
    }

    [Test]
    public async Task LoginAsync_HappyPath_ReturnsUserInfoAndSetsCookie()
    {
        // Arrange
        var user = MockDataBuilder.User()
            .WithEmail("login@example.com")
            .WithPasswordHash(BCrypt.Net.BCrypt.HashPassword("Test@1234"))
            .Build();
        _userRepoMock.Setup(r => r.GetByEmailAsync("login@example.com")).ReturnsAsync(user);

        var request = new LoginRequestDto { Email = "login@example.com", Password = "Test@1234" };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be("login@example.com");

        // Verify HttpOnly cookie was set on response
        _httpContext.Response.Headers["Set-Cookie"].ToString().Should().Contain("taskboard_auth");
    }

    [Test]
    public async Task LoginAsync_InvalidPassword_ThrowsUnauthorized()
    {
        // Arrange
        var user = MockDataBuilder.User()
            .WithEmail("login@example.com")
            .WithPasswordHash(BCrypt.Net.BCrypt.HashPassword("CorrectPassword"))
            .Build();
        _userRepoMock.Setup(r => r.GetByEmailAsync("login@example.com")).ReturnsAsync(user);

        var request = new LoginRequestDto { Email = "login@example.com", Password = "WrongPassword" };

        // Act
        var act = () => _authService.LoginAsync(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>()
            .WithMessage("Invalid credentials");
    }

    [Test]
    public async Task LoginAsync_NonExistentEmail_ThrowsUnauthorized()
    {
        // Arrange — Anti-enumeration: same error for non-existent email
        _userRepoMock.Setup(r => r.GetByEmailAsync("nobody@example.com")).ReturnsAsync((User?)null);

        var request = new LoginRequestDto { Email = "nobody@example.com", Password = "Test@1234" };

        // Act
        var act = () => _authService.LoginAsync(request);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>()
            .WithMessage("Invalid credentials");
    }

    [Test]
    public async Task LogoutAsync_ClearsAuthAndCsrfCookies()
    {
        // Act
        await _authService.LogoutAsync();

        // Assert — verify expired auth cookie and CSRF cookie deletion
        var setCookieHeader = _httpContext.Response.Headers["Set-Cookie"].ToString();
        setCookieHeader.Should().Contain("taskboard_auth");
        setCookieHeader.Should().Contain("taskboard_csrf");
    }

    [Test]
    public void PasswordHash_ShouldNotEqualPlainText()
    {
        // Arrange
        var plainText = "Test@1234";

        // Act
        var hash = BCrypt.Net.BCrypt.HashPassword(plainText, workFactor: 12);

        // Assert
        hash.Should().NotBe(plainText);
        BCrypt.Net.BCrypt.Verify(plainText, hash).Should().BeTrue();
    }
}
