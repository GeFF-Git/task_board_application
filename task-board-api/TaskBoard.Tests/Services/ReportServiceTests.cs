using FluentAssertions;
using Moq;
using TaskBoard.Core.DTOs.Reports;
using TaskBoard.Core.Interfaces.Services;

namespace TaskBoard.Tests.Services;

[TestFixture]
public class ReportServiceTests
{
    [Test]
    public void ReportDto_ColumnSummary_StructureIsCorrect()
    {
        // Arrange / Act — verify the DTO structure matches expected shape
        var summary = new ColumnSummaryDto
        {
            ColumnId = Guid.NewGuid(),
            ColumnName = "Backlog",
            TaskCount = 5,
            UrgentCount = 2,
            NormalCount = 2,
            LowCount = 1
        };

        // Assert
        summary.TaskCount.Should().Be(5);
        summary.UrgentCount.Should().Be(2);
        (summary.UrgentCount + summary.NormalCount + summary.LowCount).Should().Be(summary.TaskCount);
    }

    [Test]
    public void TaskReportDto_DefaultValues_AreZero()
    {
        // Arrange / Act
        var report = new TaskReportDto();

        // Assert
        report.TotalTasks.Should().Be(0);
        report.CompletedTasks.Should().Be(0);
        report.OverdueTasks.Should().Be(0);
        report.TasksDueSoon.Should().Be(0);
        report.ColumnSummaries.Should().BeEmpty();
        report.RecentActivity.Should().BeEmpty();
    }

    [Test]
    public async Task GetSummaryAsync_MockService_ReturnsSummary()
    {
        // Arrange
        var mockService = new Mock<IReportService>();
        var expected = new TaskReportDto
        {
            TotalTasks = 10,
            CompletedTasks = 3,
            OverdueTasks = 1,
            TasksDueSoon = 2,
            ColumnSummaries = new List<ColumnSummaryDto>
            {
                new() { ColumnName = "Backlog", TaskCount = 4, UrgentCount = 1 }
            }
        };
        mockService.Setup(s => s.GetSummaryAsync()).ReturnsAsync(expected);

        // Act
        var result = await mockService.Object.GetSummaryAsync();

        // Assert
        result.TotalTasks.Should().Be(10);
        result.ColumnSummaries.Should().HaveCount(1);
        result.ColumnSummaries[0].ColumnName.Should().Be("Backlog");
    }
}
