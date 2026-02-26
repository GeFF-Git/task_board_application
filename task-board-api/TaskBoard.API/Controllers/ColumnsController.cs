using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.DTOs.Columns;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.API.Controllers;

/// <summary>
/// Controller for managing columns.
/// </summary>
[ApiController]
[Route("api/v1/columns")]
[Authorize]
public class ColumnsController : ControllerBase
{
    private readonly IColumnService _columnService;

    public ColumnsController(IColumnService columnService)
    {
        _columnService = columnService;
    }

    /// <summary>
    /// Get all columns for the current user, ordered by Order field.
    /// </summary>
    [HttpGet]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<List<ColumnDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var columns = await _columnService.GetAllAsync();
        return Ok(ApiResponse<List<ColumnDto>>.Ok(columns));
    }

    /// <summary>
    /// Create a new column.
    /// </summary>
    [HttpPost]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<ColumnDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Create([FromBody] CreateColumnDto dto)
    {
        var column = await _columnService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), ApiResponse<ColumnDto>.Ok(column, "Column created"));
    }

    /// <summary>
    /// Update a column (name, order).
    /// </summary>
    [HttpPut("{id:guid}")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<ColumnDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateColumnDto dto)
    {
        var column = await _columnService.UpdateAsync(id, dto);
        return Ok(ApiResponse<ColumnDto>.Ok(column, "Column updated"));
    }

    /// <summary>
    /// Soft delete a column. Cannot delete if tasks exist in it.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _columnService.DeleteAsync(id);
        return Ok(ApiResponse<object>.Ok(null!, "Column deleted"));
    }

    /// <summary>
    /// Reorder multiple columns in one call.
    /// </summary>
    [HttpPatch("reorder")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Reorder([FromBody] List<ReorderColumnDto> reorderDtos)
    {
        await _columnService.ReorderAsync(reorderDtos);
        return Ok(ApiResponse<object>.Ok(null!, "Columns reordered"));
    }
}
