namespace TaskBoard.Core.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // Navigation
    public ICollection<Column> Columns { get; set; } = new List<Column>();
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
