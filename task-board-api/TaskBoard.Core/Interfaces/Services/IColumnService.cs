using TaskBoard.Core.DTOs.Columns;

namespace TaskBoard.Core.Interfaces.Services;

public interface IColumnService
{
    Task<List<ColumnDto>> GetAllAsync();
    Task<ColumnDto> CreateAsync(CreateColumnDto dto);
    Task<ColumnDto> UpdateAsync(Guid id, UpdateColumnDto dto);
    Task DeleteAsync(Guid id);
    Task ReorderAsync(List<ReorderColumnDto> reorderDtos);
}
