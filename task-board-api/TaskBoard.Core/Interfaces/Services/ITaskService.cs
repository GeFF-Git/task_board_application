using TaskBoard.Core.DTOs.Tasks;

namespace TaskBoard.Core.Interfaces.Services;

public interface ITaskService
{
    Task<List<TaskDto>> GetAllAsync(Guid? columnId, string? priority, string? search,
        string? sortBy, string? sortDirection, int page, int pageSize);
    Task<int> GetTotalCountAsync(Guid? columnId, string? priority, string? search);
    Task<TaskDto> GetByIdAsync(Guid id);
    Task<TaskDto> CreateAsync(CreateTaskDto dto);
    Task<TaskDto> UpdateAsync(Guid id, UpdateTaskDto dto);
    Task DeleteAsync(Guid id);
    Task<TaskDto> MoveAsync(Guid id, MoveTaskDto dto);
}
