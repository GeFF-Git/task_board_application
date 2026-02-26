using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace TaskBoard.API.Controllers;

/// <summary>
/// CSRF token endpoint. Angular calls this on app startup to get the CSRF token.
/// </summary>
[ApiController]
[Route("api/v1/csrf")]
public class CsrfController : ControllerBase
{
    private readonly IAntiforgery _antiforgery;
    private readonly IWebHostEnvironment _environment;

    public CsrfController(IAntiforgery antiforgery, IWebHostEnvironment environment)
    {
        _antiforgery = antiforgery;
        _environment = environment;
    }

    /// <summary>
    /// Issues a CSRF token as a readable cookie for Angular to include in X-CSRF-TOKEN header.
    /// </summary>
    [HttpGet("token")]
    [IgnoreAntiforgeryToken]
    public IActionResult GetCsrfToken()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);

        // Send the request token to Angular via a readable cookie
        Response.Cookies.Append("taskboard_csrf", tokens.RequestToken!, new CookieOptions
        {
            HttpOnly = false,           // Readable by Angular JavaScript
            Secure = _environment.IsProduction(),
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return Ok(new { message = "CSRF token issued" });
    }
}
