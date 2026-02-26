using System.Text.Json.Serialization;

namespace TaskBoard.Core.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Priority
{
    Low = 0,
    Normal = 1,
    Urgent = 2
}
