namespace TaskBoard.Core.DTOs.Columns;

/// <summary>
/// Column DTO matching the Angular Column interface.
/// </summary>
public class ColumnDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsDefault { get; set; }
    public int TaskCount { get; set; }
}
