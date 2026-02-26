using FluentValidation;
using TaskBoard.Core.DTOs.Columns;

namespace TaskBoard.Core.Validators.Columns;

public class CreateColumnValidator : AbstractValidator<CreateColumnDto>
{
    public CreateColumnValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Column name is required.")
            .MaximumLength(100).WithMessage("Column name must not exceed 100 characters.");
    }
}
