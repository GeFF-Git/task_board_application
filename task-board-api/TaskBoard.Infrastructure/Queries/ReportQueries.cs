namespace TaskBoard.Infrastructure.Queries;

/// <summary>
/// Raw SQL queries for Dapper-based report generation.
/// All queries use parameterized inputs exclusively — never string concatenation.
/// Justification: These report queries involve GROUP BY with conditional aggregation
/// across multiple tables, which would require multiple EF Core round-trips or generate
/// suboptimal LINQ-to-SQL translations.
/// </summary>
public static class ReportQueries
{
    /// <summary>
    /// Single query with GROUP BY and conditional aggregation (SUM(CASE WHEN ...))
    /// to get task counts per column broken down by priority.
    /// </summary>
    public const string ColumnSummarySql = @"
        SELECT 
            c.Id AS ColumnId,
            c.Name AS ColumnName,
            COUNT(t.Id) AS TaskCount,
            SUM(CASE WHEN t.Priority = 'Urgent' THEN 1 ELSE 0 END) AS UrgentCount,
            SUM(CASE WHEN t.Priority = 'Normal' THEN 1 ELSE 0 END) AS NormalCount,
            SUM(CASE WHEN t.Priority = 'Low' THEN 1 ELSE 0 END) AS LowCount
        FROM Columns c
        LEFT JOIN Tasks t ON t.ColumnId = c.Id AND t.IsDeleted = 0
        WHERE c.UserId = @UserId AND c.IsDeleted = 0
        GROUP BY c.Id, c.Name, c.[Order]
        ORDER BY c.[Order]";

    /// <summary>
    /// Overall statistics: total tasks, completed (in 'Done' column), overdue, and due soon.
    /// </summary>
    public const string OverallStatsSql = @"
        SELECT 
            COUNT(t.Id) AS TotalTasks,
            SUM(CASE WHEN c.Name = 'Done' THEN 1 ELSE 0 END) AS CompletedTasks,
            SUM(CASE WHEN t.DueDate < @Now AND c.Name <> 'Done' THEN 1 ELSE 0 END) AS OverdueTasks,
            SUM(CASE WHEN t.DueDate <= @DueSoonDate AND t.DueDate >= @Now AND c.Name <> 'Done' THEN 1 ELSE 0 END) AS TasksDueSoon
        FROM Tasks t
        INNER JOIN Columns c ON t.ColumnId = c.Id
        WHERE t.UserId = @UserId AND t.IsDeleted = 0 AND c.IsDeleted = 0";

    /// <summary>
    /// Recent activity — last 10 tasks updated, ordered by UpdatedAt descending.
    /// </summary>
    public const string RecentActivitySql = @"
        SELECT TOP 10
            t.Id AS TaskId,
            t.Title AS TaskTitle,
            'Updated' AS [Action],
            FORMAT(t.UpdatedAt, 'yyyy-MM-ddTHH:mm:ssZ') AS [Timestamp]
        FROM Tasks t
        WHERE t.UserId = @UserId AND t.IsDeleted = 0
        ORDER BY t.UpdatedAt DESC";
}
