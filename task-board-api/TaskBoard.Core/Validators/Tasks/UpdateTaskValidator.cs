using FluentValidation;
using TaskBoard.Core.DTOs.Tasks;

namespace TaskBoard.Core.Validators.Tasks;

public class UpdateTaskValidator : AbstractValidator<UpdateTaskDto>
{
    public UpdateTaskValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.")
            .When(x => x.Title != null);

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.")
            .When(x => x.Description != null);

        RuleFor(x => x.Priority)
            .Must(p => p is "urgent" or "normal" or "low")
            .WithMessage("Priority must be 'urgent', 'normal', or 'low'.")
            .When(x => x.Priority != null);

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Category must not exceed 100 characters.")
            .When(x => x.Category != null);
    }
}
