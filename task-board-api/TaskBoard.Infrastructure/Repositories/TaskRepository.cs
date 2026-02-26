using Microsoft.EntityFrameworkCore;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Infrastructure.Data;

namespace TaskBoard.Infrastructure.Repositories;

public class TaskRepository : GenericRepository<TaskItem>, ITaskRepository
{
    public TaskRepository(AppDbContext context) : base(context) { }

    public IQueryable<TaskItem> GetByUserId(Guid userId)
    {
        return _dbSet.AsNoTracking().Where(t => t.UserId == userId);
    }

    public IQueryable<TaskItem> GetByColumnId(Guid columnId, Guid userId)
    {
        return _dbSet.AsNoTracking().Where(t => t.ColumnId == columnId && t.UserId == userId);
    }

    public async Task<int> GetCountByColumnAsync(Guid columnId, Guid userId)
    {
        return await _dbSet.AsNoTracking()
            .Where(t => t.ColumnId == columnId && t.UserId == userId)
            .CountAsync();
    }
}
