namespace TaskBoard.Core.DTOs;

/// <summary>
/// Standard API response envelope matching the Angular ApiResponse interface.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public string Timestamp { get; set; } = DateTime.UtcNow.ToString("o");
    public List<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null) => new()
    {
        Success = true,
        Data = data,
        Message = message
    };

    public static ApiResponse<T> Fail(string message, List<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors
    };
}

/// <summary>
/// Paginated API response matching the Angular PaginatedResponse interface.
/// </summary>
public class PaginatedResponse<T> : ApiResponse<List<T>>
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }

    public static PaginatedResponse<T> Ok(List<T> data, int total, int page, int pageSize, string? message = null) => new()
    {
        Success = true,
        Data = data,
        Total = total,
        Page = page,
        PageSize = pageSize,
        Message = message
    };
}
