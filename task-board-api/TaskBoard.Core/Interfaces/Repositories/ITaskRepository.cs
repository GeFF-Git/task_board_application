using TaskBoard.Core.Entities;

namespace TaskBoard.Core.Interfaces.Repositories;

public interface ITaskRepository : IRepository<TaskItem>
{
    IQueryable<TaskItem> GetByUserId(Guid userId);
    IQueryable<TaskItem> GetByColumnId(Guid columnId, Guid userId);
    Task<int> GetCountByColumnAsync(Guid columnId, Guid userId);
}
