using Microsoft.EntityFrameworkCore;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Infrastructure.Data;

namespace TaskBoard.Infrastructure.Repositories;

public class ColumnRepository : GenericRepository<Column>, IColumnRepository
{
    public ColumnRepository(AppDbContext context) : base(context) { }

    public IQueryable<Column> GetByUserId(Guid userId)
    {
        return _dbSet.AsNoTracking().Where(c => c.UserId == userId);
    }

    public async Task<int> GetMaxOrderAsync(Guid userId)
    {
        var hasColumns = await _dbSet.AsNoTracking().AnyAsync(c => c.UserId == userId);
        if (!hasColumns) return -1;
        return await _dbSet.AsNoTracking()
            .Where(c => c.UserId == userId)
            .MaxAsync(c => c.Order);
    }
}
