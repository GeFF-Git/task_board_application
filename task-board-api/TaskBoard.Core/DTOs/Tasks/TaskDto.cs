namespace TaskBoard.Core.DTOs.Tasks;

/// <summary>
/// Task DTO matching the Angular Task interface exactly.
/// </summary>
public class TaskDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Guid ColumnId { get; set; }
    public List<string> AssigneeIds { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public string CategoryEmoji { get; set; } = string.Empty;
    public string DueDate { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public int CommentCount { get; set; }
    public int SubtaskCount { get; set; }
    public int SubtaskCompleted { get; set; }
    public string? ExternalId { get; set; }
}
