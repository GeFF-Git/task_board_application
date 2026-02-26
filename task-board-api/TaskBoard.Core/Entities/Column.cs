namespace TaskBoard.Core.Entities;

public class Column : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsDefault { get; set; } = false;

    // Foreign Keys
    public Guid UserId { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
