using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TaskBoard.API.Filters;

/// <summary>
/// Custom action filter that runs FluentValidation on every request DTO before the action executes.
/// Replaces default ASP.NET Core model state validation with FluentValidation.
/// </summary>
public class ValidationFilter : IAsyncActionFilter
{
    private readonly IServiceProvider _serviceProvider;

    public ValidationFilter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument == null) continue;

            var argumentType = argument.GetType();
            var validatorType = typeof(IValidator<>).MakeGenericType(argumentType);
            var validator = _serviceProvider.GetService(validatorType) as IValidator;

            if (validator == null) continue;

            var validationContext = new ValidationContext<object>(argument);
            var result = await validator.ValidateAsync(validationContext);

            if (!result.IsValid)
            {
                var errors = result.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray()
                    );

                var response = new
                {
                    success = false,
                    message = "One or more validation errors occurred.",
                    errors = result.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}").ToList(),
                    details = errors,
                    timestamp = DateTime.UtcNow.ToString("o")
                };

                context.Result = new UnprocessableEntityObjectResult(response);
                return;
            }
        }

        await next();
    }
}
