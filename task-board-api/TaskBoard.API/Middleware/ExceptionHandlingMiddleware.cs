using System.Net;
using System.Text.Json;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.Exceptions;

namespace TaskBoard.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var correlationId = context.Items["CorrelationId"]?.ToString() ?? Guid.NewGuid().ToString();
            _logger.LogError(ex, "Unhandled exception. CorrelationId: {CorrelationId}", correlationId);
            await HandleExceptionAsync(context, ex, correlationId);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception, string correlationId)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message, errors) = exception switch
        {
            NotFoundException nfe => ((int)HttpStatusCode.NotFound, nfe.Message, (List<string>?)null),
            UnauthorizedException => ((int)HttpStatusCode.Forbidden, "Access denied", (List<string>?)null),
            ValidationException ve => ((int)HttpStatusCode.UnprocessableEntity, ve.Message,
                ve.Errors.SelectMany(e => e.Value.Select(v => $"{e.Key}: {v}")).ToList()),
            FluentValidation.ValidationException fve => ((int)HttpStatusCode.UnprocessableEntity,
                "One or more validation errors occurred.",
                fve.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}").ToList()),
            ArgumentException ae => ((int)HttpStatusCode.BadRequest, ae.Message, (List<string>?)null),
            _ => ((int)HttpStatusCode.InternalServerError, "An unexpected error occurred", (List<string>?)null),
        };

        context.Response.StatusCode = statusCode;

        var response = new
        {
            success = false,
            message,
            errors,
            timestamp = DateTime.UtcNow.ToString("o"),
            correlationId
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
