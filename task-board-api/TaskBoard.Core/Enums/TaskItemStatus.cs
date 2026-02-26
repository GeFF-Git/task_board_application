using System.Text.Json.Serialization;

namespace TaskBoard.Core.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TaskItemStatus
{
    Backlog,
    InProgress,
    Validation,
    Done
}
