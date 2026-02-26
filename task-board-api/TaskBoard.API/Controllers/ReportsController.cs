using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.DTOs.Reports;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.API.Controllers;

/// <summary>
/// Controller for report endpoints. Uses Dapper for optimized queries.
/// </summary>
[ApiController]
[Route("api/v1/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// Get task report summary with column breakdowns and overall statistics.
    /// </summary>
    [HttpGet("summary")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType(typeof(ApiResponse<TaskReportDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary()
    {
        var report = await _reportService.GetSummaryAsync();
        return Ok(ApiResponse<TaskReportDto>.Ok(report));
    }
}
