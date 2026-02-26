namespace TaskBoard.Core.DTOs.Reports;

public class TaskReportDto
{
    public List<ColumnSummaryDto> ColumnSummaries { get; set; } = new();
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int OverdueTasks { get; set; }
    public int TasksDueSoon { get; set; }
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
}

public class ColumnSummaryDto
{
    public Guid ColumnId { get; set; }
    public string ColumnName { get; set; } = string.Empty;
    public int TaskCount { get; set; }
    public int UrgentCount { get; set; }
    public int NormalCount { get; set; }
    public int LowCount { get; set; }
}

public class RecentActivityDto
{
    public Guid TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
}
