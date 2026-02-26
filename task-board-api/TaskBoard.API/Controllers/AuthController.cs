using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.DTOs.Auth;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.API.Controllers;

/// <summary>
/// Authentication controller for user registration, login, and logout.
/// </summary>
[ApiController]
[Route("api/v1/auth")]
[EnableRateLimiting("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Register a new user account. JWT is set as HttpOnly cookie.
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Registration successful"));
    }

    /// <summary>
    /// Login with email and password. JWT is set as HttpOnly cookie.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Login successful"));
    }

    /// <summary>
    /// Logout — clears auth cookie and CSRF cookie.
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await _authService.LogoutAsync();
        return Ok(new ApiResponse<object> { Success = true, Message = "Logged out successfully" });
    }

    /// <summary>
    /// Get currently authenticated user profile
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    public IActionResult GetCurrentUser()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new ApiResponse<object> { Success = false, Message = "Invalid token" });
        }

        var fullName = User.FindFirstValue("name") ?? string.Empty;
        var email = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;

        var userDto = new AuthResponseDto
        {
            UserId = userId,
            FullName = fullName,
            Email = email
        };

        return Ok(ApiResponse<AuthResponseDto>.Ok(userDto, "User retrieved"));
    }
}
