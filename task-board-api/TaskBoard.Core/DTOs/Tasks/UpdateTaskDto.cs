namespace TaskBoard.Core.DTOs.Tasks;

public class UpdateTaskDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Priority { get; set; }
    public string? DueDate { get; set; }
    public Guid? ColumnId { get; set; }
    public List<string>? AssigneeIds { get; set; }
    public string? Category { get; set; }
    public string? CategoryEmoji { get; set; }
    public string? Status { get; set; }
}
