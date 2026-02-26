using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Core.DTOs.Columns;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Exceptions;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.Infrastructure.Services;

public class ColumnService : IColumnService
{
    private readonly IColumnRepository _columnRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IMapper _mapper;
    private readonly Guid _currentUserId;

    public ColumnService(
        IColumnRepository columnRepository,
        ITaskRepository taskRepository,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor)
    {
        _columnRepository = columnRepository;
        _taskRepository = taskRepository;
        _mapper = mapper;

        var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        _currentUserId = userIdClaim != null ? Guid.Parse(userIdClaim) : Guid.Empty;
    }

    public async Task<List<ColumnDto>> GetAllAsync()
    {
        var columns = await _columnRepository.GetByUserId(_currentUserId)
            .OrderBy(c => c.Order)
            .ToListAsync();

        var columnDtos = new List<ColumnDto>();
        foreach (var column in columns)
        {
            var taskCount = await _taskRepository.GetCountByColumnAsync(column.Id, _currentUserId);
            columnDtos.Add(new ColumnDto
            {
                Id = column.Id,
                Name = column.Name,
                Order = column.Order,
                IsDefault = column.IsDefault,
                TaskCount = taskCount
            });
        }

        return columnDtos;
    }

    public async Task<ColumnDto> CreateAsync(CreateColumnDto dto)
    {
        var maxOrder = await _columnRepository.GetMaxOrderAsync(_currentUserId);

        var column = new Column
        {
            Name = dto.Name,
            Order = maxOrder + 1,
            UserId = _currentUserId,
            IsDefault = false
        };

        await _columnRepository.AddAsync(column);

        return new ColumnDto
        {
            Id = column.Id,
            Name = column.Name,
            Order = column.Order,
            IsDefault = column.IsDefault,
            TaskCount = 0
        };
    }

    public async Task<ColumnDto> UpdateAsync(Guid id, UpdateColumnDto dto)
    {
        var column = await _columnRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Column {id} not found");

        if (column.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        if (dto.Name != null) column.Name = dto.Name;
        if (dto.Order.HasValue) column.Order = dto.Order.Value;

        await _columnRepository.UpdateAsync(column);

        var taskCount = await _taskRepository.GetCountByColumnAsync(column.Id, _currentUserId);
        return new ColumnDto
        {
            Id = column.Id,
            Name = column.Name,
            Order = column.Order,
            IsDefault = column.IsDefault,
            TaskCount = taskCount
        };
    }

    public async Task DeleteAsync(Guid id)
    {
        var column = await _columnRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Column {id} not found");

        if (column.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        // Cannot delete if tasks exist in the column
        var taskCount = await _taskRepository.GetCountByColumnAsync(id, _currentUserId);
        if (taskCount > 0)
        {
            throw new Core.Exceptions.ValidationException("Column",
                $"Cannot delete column '{column.Name}' because it contains {taskCount} task(s). Move or delete all tasks first.");
        }

        await _columnRepository.DeleteAsync(id);
    }

    public async Task ReorderAsync(List<ReorderColumnDto> reorderDtos)
    {
        foreach (var dto in reorderDtos)
        {
            var column = await _columnRepository.GetByIdAsync(dto.Id)
                ?? throw new NotFoundException($"Column {dto.Id} not found");

            if (column.UserId != _currentUserId)
                throw new Core.Exceptions.UnauthorizedException("Access denied");

            column.Order = dto.Order;
            await _columnRepository.UpdateAsync(column);
        }
    }
}
