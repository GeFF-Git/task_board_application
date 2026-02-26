using TaskBoard.Core.Entities;

namespace TaskBoard.Core.Interfaces.Repositories;

public interface IColumnRepository : IRepository<Column>
{
    IQueryable<Column> GetByUserId(Guid userId);
    Task<int> GetMaxOrderAsync(Guid userId);
}
