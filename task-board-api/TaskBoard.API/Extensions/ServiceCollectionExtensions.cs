using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskBoard.API.Filters;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Core.Interfaces.Services;
using TaskBoard.Core.Validators.Auth;
using TaskBoard.Infrastructure.Data;
using TaskBoard.Infrastructure.Mappings;
using TaskBoard.Infrastructure.Repositories;
using TaskBoard.Infrastructure.Services;
using TaskBoard.Infrastructure.Settings;

namespace TaskBoard.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database — read connection string exclusively from appsettings.json
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorNumbersToAdd: null
                    );
                    sqlOptions.CommandTimeout(30);
                    sqlOptions.MigrationsAssembly("TaskBoard.Infrastructure");
                }
            )
        );

        // Strongly-typed settings
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        services.Configure<CorsSettings>(configuration.GetSection("CorsSettings"));
        services.Configure<RateLimitingSettings>(configuration.GetSection("RateLimiting"));

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped<ITaskRepository, TaskRepository>();
        services.AddScoped<IColumnRepository, ColumnRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITaskService, TaskService>();
        services.AddScoped<IColumnService, ColumnService>();
        services.AddScoped<IReportService, ReportService>();

        // AutoMapper — scan all profiles from the Infrastructure assembly
        services.AddAutoMapper(typeof(TaskProfile).Assembly);

        // FluentValidation — auto-register all validators from Core assembly
        services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

        // Validation filter
        services.AddScoped<ValidationFilter>();

        // HttpContextAccessor for extracting UserId from JWT claims in services
        services.AddHttpContextAccessor();

        return services;
    }
}
