using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskBoard.Core.Entities;

namespace TaskBoard.Infrastructure.Data.Configurations;

public class ColumnConfiguration : IEntityTypeConfiguration<Column>
{
    public void Configure(EntityTypeBuilder<Column> builder)
    {
        builder.ToTable("Columns");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .ValueGeneratedNever();

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Order)
            .IsRequired();

        builder.Property(c => c.IsDefault)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(c => c.UserId)
            .IsRequired();

        builder.Property(c => c.CreatedAt)
            .IsRequired();

        builder.Property(c => c.UpdatedAt)
            .IsRequired();

        builder.Property(c => c.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(c => c.DeletedAt)
            .IsRequired(false);

        // Composite index for per-user column queries ordered by display order
        builder.HasIndex(c => new { c.UserId, c.Order })
            .HasDatabaseName("IX_Columns_UserId_Order");

        // Index for soft delete filter performance
        builder.HasIndex(c => c.IsDeleted)
            .HasDatabaseName("IX_Columns_IsDeleted");

        // Global query filter
        builder.HasQueryFilter(c => !c.IsDeleted);

        // Relationship: Column belongs to User
        builder.HasOne(c => c.User)
            .WithMany(u => u.Columns)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Columns_Users_UserId");
    }
}
