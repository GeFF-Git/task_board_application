namespace TaskBoard.Core.DTOs.Auth;

/// <summary>
/// Response returned after login/register. JWT is set as HttpOnly cookie — never in the body.
/// </summary>
public class AuthResponseDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
