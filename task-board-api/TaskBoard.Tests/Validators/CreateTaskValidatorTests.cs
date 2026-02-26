using FluentAssertions;
using FluentValidation.TestHelper;
using TaskBoard.Core.DTOs.Tasks;
using TaskBoard.Core.Validators.Tasks;

namespace TaskBoard.Tests.Validators;

[TestFixture]
public class CreateTaskValidatorTests
{
    private CreateTaskValidator _validator;

    [SetUp]
    public void Setup()
    {
        _validator = new CreateTaskValidator();
    }

    [Test]
    public void ValidTask_PassesValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Valid Task",
            Priority = "normal",
            ColumnId = Guid.NewGuid()
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Test]
    public void EmptyTitle_FailsValidation()
    {
        // Arrange
        var dto = new CreateTaskDto { Title = "", Priority = "normal", ColumnId = Guid.NewGuid() };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Test]
    public void TitleTooLong_FailsValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = new string('x', 201),
            Priority = "normal",
            ColumnId = Guid.NewGuid()
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Test]
    public void InvalidPriority_FailsValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Task",
            Priority = "critical",  // Invalid — must be urgent, normal, or low
            ColumnId = Guid.NewGuid()
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Priority);
    }

    [Test]
    public void EmptyColumnId_FailsValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Task",
            Priority = "normal",
            ColumnId = Guid.Empty
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.ColumnId);
    }

    [Test]
    public void DescriptionTooLong_FailsValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Task",
            Priority = "normal",
            ColumnId = Guid.NewGuid(),
            Description = new string('x', 2001)
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }
}
