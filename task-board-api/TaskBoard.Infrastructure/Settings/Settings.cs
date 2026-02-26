namespace TaskBoard.Infrastructure.Settings;

public class JwtSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int AccessTokenExpiryMinutes { get; set; } = 60;
    public int RememberMeExpiryDays { get; set; } = 7;
    public string CookieName { get; set; } = "taskboard_auth";
}

public class CorsSettings
{
    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
    public bool AllowCredentials { get; set; } = true;
}

public class RateLimitingSettings
{
    public int GlobalWindowMinutes { get; set; } = 1;
    public int GlobalMaxRequests { get; set; } = 100;
    public int AuthWindowMinutes { get; set; } = 1;
    public int AuthMaxRequests { get; set; } = 10;
}
