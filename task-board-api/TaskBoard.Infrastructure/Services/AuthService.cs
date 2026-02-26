using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TaskBoard.Core.DTOs.Auth;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Exceptions;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Core.Interfaces.Services;
using TaskBoard.Infrastructure.Settings;

namespace TaskBoard.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IColumnRepository _columnRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IWebHostEnvironment _environment;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        IUserRepository userRepository,
        IColumnRepository columnRepository,
        IHttpContextAccessor httpContextAccessor,
        IWebHostEnvironment environment,
        IOptions<JwtSettings> jwtSettings)
    {
        _userRepository = userRepository;
        _columnRepository = columnRepository;
        _httpContextAccessor = httpContextAccessor;
        _environment = environment;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        // Anti-enumeration: generic error message regardless of whether email exists or password is wrong
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new Core.Exceptions.UnauthorizedException("Invalid credentials");
        }

        var expiryMinutes = request.RememberMe
            ? _jwtSettings.RememberMeExpiryDays * 24 * 60
            : _jwtSettings.AccessTokenExpiryMinutes;

        var token = GenerateJwtToken(user, expiryMinutes);

        // Write JWT into HttpOnly cookie — never returned in response body
        AppendAuthCookie(token, expiryMinutes);

        return new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (await _userRepository.EmailExistsAsync(request.Email))
        {
            throw new Core.Exceptions.ValidationException("Email", "An account with this email already exists.");
        }

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            FullName = request.FullName
        };

        await _userRepository.AddAsync(user);

        // Seed default columns for the new user
        await SeedDefaultColumnsAsync(user.Id);

        var token = GenerateJwtToken(user, _jwtSettings.AccessTokenExpiryMinutes);

        // Write JWT into HttpOnly cookie — never returned in response body
        AppendAuthCookie(token, _jwtSettings.AccessTokenExpiryMinutes);

        return new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email
        };
    }

    public Task LogoutAsync()
    {
        var cookieName = _jwtSettings.CookieName;

        // Clear auth cookie by overwriting with expired cookie
        _httpContextAccessor.HttpContext!.Response.Cookies.Append(
            cookieName,
            string.Empty,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = _environment.IsProduction(),
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(-1),   // Expired — browser deletes it
                Path = "/"
            }
        );

        // Clear CSRF cookie as well
        _httpContextAccessor.HttpContext!.Response.Cookies.Delete("taskboard_csrf");

        return Task.CompletedTask;
    }

    /// <summary>
    /// Writes the JWT into an HttpOnly cookie. Never returns the token in the response body.
    /// </summary>
    private void AppendAuthCookie(string token, int expiryMinutes)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = _environment.IsProduction(),   // HTTPS only in production, HTTP allowed in development
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(expiryMinutes),
            Path = "/",
            IsEssential = true
        };

        _httpContextAccessor.HttpContext!.Response.Cookies.Append(
            _jwtSettings.CookieName,
            token,
            cookieOptions
        );
    }

    /// <summary>
    /// Seeds the 4 default columns for a newly registered user.
    /// </summary>
    private async Task SeedDefaultColumnsAsync(Guid userId)
    {
        var defaultColumns = new List<Column>
        {
            new() { Id = Guid.NewGuid(), Name = "Backlog",     Order = 1, IsDefault = true, UserId = userId },
            new() { Id = Guid.NewGuid(), Name = "In Progress", Order = 2, IsDefault = true, UserId = userId },
            new() { Id = Guid.NewGuid(), Name = "Validation",  Order = 3, IsDefault = true, UserId = userId },
            new() { Id = Guid.NewGuid(), Name = "Done",        Order = 4, IsDefault = true, UserId = userId }
        };

        foreach (var column in defaultColumns)
        {
            await _columnRepository.AddAsync(column);
        }
    }

    private string GenerateJwtToken(User user, int expiryMinutes)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("name", user.FullName),
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
