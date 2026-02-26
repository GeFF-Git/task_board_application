using FluentValidation;
using TaskBoard.Core.DTOs.Columns;

namespace TaskBoard.Core.Validators.Columns;

public class UpdateColumnValidator : AbstractValidator<UpdateColumnDto>
{
    public UpdateColumnValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Column name must not exceed 100 characters.")
            .When(x => x.Name != null);

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0).WithMessage("Order must be non-negative.")
            .When(x => x.Order.HasValue);
    }
}
