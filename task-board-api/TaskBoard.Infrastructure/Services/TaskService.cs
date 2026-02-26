using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Core.DTOs.Tasks;
using TaskBoard.Core.Entities;
using TaskBoard.Core.Enums;
using TaskBoard.Core.Exceptions;
using TaskBoard.Core.Interfaces.Repositories;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IColumnRepository _columnRepository;
    private readonly IMapper _mapper;
    private readonly Guid _currentUserId;

    public TaskService(
        ITaskRepository taskRepository,
        IColumnRepository columnRepository,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor)
    {
        _taskRepository = taskRepository;
        _columnRepository = columnRepository;
        _mapper = mapper;

        var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        _currentUserId = userIdClaim != null ? Guid.Parse(userIdClaim) : Guid.Empty;
    }

    public async Task<List<TaskDto>> GetAllAsync(Guid? columnId, string? priority, string? search,
        string? sortBy, string? sortDirection, int page, int pageSize)
    {
        var query = _taskRepository.GetByUserId(_currentUserId);

        // Apply filters
        if (columnId.HasValue)
            query = query.Where(t => t.ColumnId == columnId.Value);

        if (!string.IsNullOrWhiteSpace(priority) && Enum.TryParse<Priority>(priority, true, out var p))
            query = query.Where(t => t.Priority == p);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t => t.Title.Contains(search) || (t.Description != null && t.Description.Contains(search)));

        // Apply sorting
        query = (sortBy?.ToLower(), sortDirection?.ToLower()) switch
        {
            ("title", "desc") => query.OrderByDescending(t => t.Title),
            ("title", _) => query.OrderBy(t => t.Title),
            ("priority", "desc") => query.OrderByDescending(t => t.Priority),
            ("priority", _) => query.OrderBy(t => t.Priority),
            ("duedate", "desc") => query.OrderByDescending(t => t.DueDate),
            ("duedate", _) => query.OrderBy(t => t.DueDate),
            ("createdat", "desc") => query.OrderByDescending(t => t.CreatedAt),
            _ => query.OrderByDescending(t => t.CreatedAt),
        };

        // Paginate
        var tasks = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(t => t.Column)
            .ToListAsync();

        return tasks.Select(MapToDto).ToList();
    }

    public async Task<int> GetTotalCountAsync(Guid? columnId, string? priority, string? search)
    {
        var query = _taskRepository.GetByUserId(_currentUserId);

        if (columnId.HasValue)
            query = query.Where(t => t.ColumnId == columnId.Value);

        if (!string.IsNullOrWhiteSpace(priority) && Enum.TryParse<Priority>(priority, true, out var p))
            query = query.Where(t => t.Priority == p);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t => t.Title.Contains(search) || (t.Description != null && t.Description.Contains(search)));

        return await query.CountAsync();
    }

    public async Task<TaskDto> GetByIdAsync(Guid id)
    {
        var task = await _taskRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task {id} not found");

        if (task.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        return MapToDto(task);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto dto)
    {
        // Verify the column belongs to the current user
        var column = await _columnRepository.GetByIdAsync(dto.ColumnId)
            ?? throw new NotFoundException($"Column {dto.ColumnId} not found");

        if (column.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = Enum.TryParse<Priority>(dto.Priority, true, out var p) ? p : Priority.Normal,
            DueDate = !string.IsNullOrWhiteSpace(dto.DueDate) ? DateTime.Parse(dto.DueDate) : null,
            ColumnId = dto.ColumnId,
            UserId = _currentUserId,
            Category = dto.Category ?? "General",
            CategoryEmoji = dto.CategoryEmoji,
            AssigneeIds = dto.AssigneeIds ?? new List<string>(),
            ExternalId = $"MDS-{new Random().Next(1, 999):D2}",
            CommentCount = 0,
            SubtaskCount = 0,
            SubtaskCompleted = 0
        };

        await _taskRepository.AddAsync(task);
        task.Column = column;
        return MapToDto(task);
    }

    public async Task<TaskDto> UpdateAsync(Guid id, UpdateTaskDto dto)
    {
        var task = await _taskRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task {id} not found");

        if (task.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        // Apply partial updates
        if (dto.Title != null) task.Title = dto.Title;
        if (dto.Description != null) task.Description = dto.Description;
        if (dto.Priority != null && Enum.TryParse<Priority>(dto.Priority, true, out var p)) task.Priority = p;
        if (dto.DueDate != null) task.DueDate = DateTime.Parse(dto.DueDate);
        if (dto.Category != null) task.Category = dto.Category;
        if (dto.CategoryEmoji != null) task.CategoryEmoji = dto.CategoryEmoji;
        if (dto.AssigneeIds != null) task.AssigneeIds = dto.AssigneeIds;

        if (dto.ColumnId.HasValue)
        {
            var column = await _columnRepository.GetByIdAsync(dto.ColumnId.Value)
                ?? throw new NotFoundException($"Column {dto.ColumnId.Value} not found");
            if (column.UserId != _currentUserId)
                throw new Core.Exceptions.UnauthorizedException("Access denied");
            task.ColumnId = dto.ColumnId.Value;
        }

        await _taskRepository.UpdateAsync(task);
        return MapToDto(task);
    }

    public async Task DeleteAsync(Guid id)
    {
        var task = await _taskRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task {id} not found");

        if (task.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        await _taskRepository.DeleteAsync(id);
    }

    public async Task<TaskDto> MoveAsync(Guid id, MoveTaskDto dto)
    {
        var task = await _taskRepository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task {id} not found");

        if (task.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        var column = await _columnRepository.GetByIdAsync(dto.ColumnId)
            ?? throw new NotFoundException($"Column {dto.ColumnId} not found");

        if (column.UserId != _currentUserId)
            throw new Core.Exceptions.UnauthorizedException("Access denied");

        task.ColumnId = dto.ColumnId;
        await _taskRepository.UpdateAsync(task);
        task.Column = column;
        return MapToDto(task);
    }

    private TaskDto MapToDto(TaskItem task)
    {
        // Derive status from column name (matching frontend convention)
        var status = task.Column?.Name?.ToLower().Replace(" ", "-") ?? "backlog";

        return new TaskDto
        {
            Id = task.Id,
            Code = task.ExternalId ?? $"MDS-{task.Id.ToString()[..4].ToUpper()}",
            Title = task.Title,
            Description = task.Description ?? string.Empty,
            Priority = task.Priority.ToString().ToLower(),
            Status = status,
            ColumnId = task.ColumnId,
            AssigneeIds = task.AssigneeIds ?? new List<string>(),
            Category = task.Category ?? string.Empty,
            CategoryEmoji = task.CategoryEmoji ?? string.Empty,
            DueDate = task.DueDate?.ToString("yyyy-MM-dd") ?? string.Empty,
            CreatedAt = task.CreatedAt.ToString("o"),
            UpdatedAt = task.UpdatedAt.ToString("o"),
            CommentCount = task.CommentCount,
            SubtaskCount = task.SubtaskCount,
            SubtaskCompleted = task.SubtaskCompleted,
            ExternalId = task.ExternalId,
        };
    }
}
