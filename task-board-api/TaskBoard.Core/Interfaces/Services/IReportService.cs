using TaskBoard.Core.DTOs.Reports;

namespace TaskBoard.Core.Interfaces.Services;

public interface IReportService
{
    Task<TaskReportDto> GetSummaryAsync();
}
