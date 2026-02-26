using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskBoard.Core.Entities;

namespace TaskBoard.Infrastructure.Data.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("Tasks");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .ValueGeneratedNever();

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Description)
            .IsRequired(false)
            .HasMaxLength(2000);

        builder.Property(t => t.Priority)
            .IsRequired()
            .HasConversion<string>()        // Store as string in DB for readability
            .HasMaxLength(20);

        builder.Property(t => t.DueDate)
            .IsRequired(false);

        builder.Property(t => t.Category)
            .IsRequired(false)
            .HasMaxLength(100);

        builder.Property(t => t.CategoryEmoji)
            .IsRequired(false)
            .HasMaxLength(10);

        builder.Property(t => t.ExternalId)
            .IsRequired(false)
            .HasMaxLength(50);

        builder.Property(t => t.AssigneeIds)
            .HasConversion(
                v => string.Join(',', v),
                v => string.IsNullOrEmpty(v) ? new List<string>() : v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            )
            .Metadata.SetValueComparer(
                new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<string>>(
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()
                )
            );

        builder.Property(t => t.ColumnId)
            .IsRequired();

        builder.Property(t => t.UserId)
            .IsRequired();

        builder.Property(t => t.CreatedAt)
            .IsRequired();

        builder.Property(t => t.UpdatedAt)
            .IsRequired();

        builder.Property(t => t.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(t => t.DeletedAt)
            .IsRequired(false);

        // Composite index for per-user task queries filtered by column
        builder.HasIndex(t => new { t.UserId, t.ColumnId })
            .HasDatabaseName("IX_Tasks_UserId_ColumnId");

        // Index for due date queries (overdue tasks, tasks due soon)
        builder.HasIndex(t => t.DueDate)
            .HasDatabaseName("IX_Tasks_DueDate");

        // Index for priority filtering
        builder.HasIndex(t => new { t.UserId, t.Priority })
            .HasDatabaseName("IX_Tasks_UserId_Priority");

        // Index for soft delete filter performance
        builder.HasIndex(t => t.IsDeleted)
            .HasDatabaseName("IX_Tasks_IsDeleted");

        // Global query filter
        builder.HasQueryFilter(t => !t.IsDeleted);

        // Relationship: Task belongs to Column
        builder.HasOne(t => t.Column)
            .WithMany(c => c.Tasks)
            .HasForeignKey(t => t.ColumnId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Tasks_Columns_ColumnId");

        // Relationship: Task belongs to User
        builder.HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Tasks_Users_UserId");
    }
}
