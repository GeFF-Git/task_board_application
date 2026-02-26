namespace TaskBoard.Core.DTOs.Tasks;

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = "normal";
    public string? DueDate { get; set; }
    public Guid ColumnId { get; set; }
    public List<string> AssigneeIds { get; set; } = new();
    public string? Category { get; set; }
    public string? CategoryEmoji { get; set; }
}
