using System.Security.Claims;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using TaskBoard.Core.DTOs.Reports;
using TaskBoard.Core.Interfaces.Services;
using TaskBoard.Infrastructure.Queries;

namespace TaskBoard.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly string _connectionString;
    private readonly Guid _currentUserId;

    public ReportService(
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection string not found");

        var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        _currentUserId = userIdClaim != null ? Guid.Parse(userIdClaim) : Guid.Empty;
    }

    public async Task<TaskReportDto> GetSummaryAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        // Use Dapper with single optimized SQL query instead of multiple EF Core round-trips.
        // Justification: The report summary needs GROUP BY with conditional aggregation across
        // multiple tables. A single SQL query with SUM(CASE WHEN ...) is significantly more
        // efficient than multiple EF queries, which would require N+1 round-trips or complex
        // LINQ expressions that produce suboptimal SQL.
        var columnSummaries = (await connection.QueryAsync<ColumnSummaryDto>(
            ReportQueries.ColumnSummarySql,
            new { UserId = _currentUserId }
        )).ToList();

        var overallStats = await connection.QueryFirstOrDefaultAsync<dynamic>(
            ReportQueries.OverallStatsSql,
            new { UserId = _currentUserId, DueSoonDate = DateTime.UtcNow.AddDays(3), Now = DateTime.UtcNow }
        );

        var recentActivity = (await connection.QueryAsync<RecentActivityDto>(
            ReportQueries.RecentActivitySql,
            new { UserId = _currentUserId }
        )).ToList();

        return new TaskReportDto
        {
            ColumnSummaries = columnSummaries,
            TotalTasks = (int)(overallStats?.TotalTasks ?? 0),
            CompletedTasks = (int)(overallStats?.CompletedTasks ?? 0),
            OverdueTasks = (int)(overallStats?.OverdueTasks ?? 0),
            TasksDueSoon = (int)(overallStats?.TasksDueSoon ?? 0),
            RecentActivity = recentActivity
        };
    }
}
