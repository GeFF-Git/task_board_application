using TaskBoard.Core.Enums;

namespace TaskBoard.Core.Entities;

public class TaskItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Priority Priority { get; set; } = Priority.Normal;
    public DateTime? DueDate { get; set; }
    public string? Category { get; set; }
    public string? CategoryEmoji { get; set; }
    public string? ExternalId { get; set; }
    public List<string> AssigneeIds { get; set; } = new();
    public int CommentCount { get; set; } = 0;
    public int SubtaskCount { get; set; } = 0;
    public int SubtaskCompleted { get; set; } = 0;

    // Foreign Keys
    public Guid ColumnId { get; set; }
    public Guid UserId { get; set; }

    // Navigation
    public Column Column { get; set; } = null!;
    public User User { get; set; } = null!;
}
