using TaskBoard.Core.DTOs.Auth;

namespace TaskBoard.Core.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task LogoutAsync();
}
