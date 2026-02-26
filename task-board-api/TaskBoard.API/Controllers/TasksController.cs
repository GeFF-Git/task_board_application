using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.DTOs.Tasks;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.API.Controllers;

/// <summary>
/// Controller for managing tasks.
/// </summary>
[ApiController]
[Route("api/v1/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <summary>
    /// Get all tasks for the current user with optional filtering, sorting, and pagination.
    /// </summary>
    [HttpGet]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(PaginatedResponse<TaskDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] Guid? columnId,
        [FromQuery] string? priority,
        [FromQuery] string? search,
        [FromQuery] string? sortBy,
        [FromQuery] string? sortDirection,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var tasks = await _taskService.GetAllAsync(columnId, priority, search, sortBy, sortDirection, page, pageSize);
        var total = await _taskService.GetTotalCountAsync(columnId, priority, search);
        return Ok(PaginatedResponse<TaskDto>.Ok(tasks, total, page, pageSize));
    }

    /// <summary>
    /// Get a single task by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var task = await _taskService.GetByIdAsync(id);
        return Ok(ApiResponse<TaskDto>.Ok(task));
    }

    /// <summary>
    /// Create a new task.
    /// </summary>
    [HttpPost]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        var task = await _taskService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, ApiResponse<TaskDto>.Ok(task, "Task created"));
    }

    /// <summary>
    /// Update an existing task.
    /// </summary>
    [HttpPut("{id:guid}")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto dto)
    {
        var task = await _taskService.UpdateAsync(id, dto);
        return Ok(ApiResponse<TaskDto>.Ok(task, "Task updated"));
    }

    /// <summary>
    /// Soft delete a task.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _taskService.DeleteAsync(id);
        return Ok(ApiResponse<object>.Ok(null!, "Task deleted"));
    }

    /// <summary>
    /// Move a task to a different column.
    /// </summary>
    [HttpPatch("{id:guid}/move")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Move(Guid id, [FromBody] MoveTaskDto dto)
    {
        var task = await _taskService.MoveAsync(id, dto);
        return Ok(ApiResponse<TaskDto>.Ok(task, "Task moved"));
    }
}
