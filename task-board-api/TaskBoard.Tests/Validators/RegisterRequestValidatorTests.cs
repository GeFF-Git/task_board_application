using FluentAssertions;
using FluentValidation.TestHelper;
using TaskBoard.Core.DTOs.Auth;
using TaskBoard.Core.Validators.Auth;

namespace TaskBoard.Tests.Validators;

[TestFixture]
public class RegisterRequestValidatorTests
{
    private RegisterRequestValidator _validator;

    [SetUp]
    public void Setup()
    {
        _validator = new RegisterRequestValidator();
    }

    [Test]
    public void ValidRequest_PassesValidation()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            FullName = "Test User",
            Email = "test@example.com",
            Password = "Str0ng@Pass",
            ConfirmPassword = "Str0ng@Pass"
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Test]
    public void EmptyEmail_FailsValidation()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            FullName = "Test",
            Email = "",
            Password = "Str0ng@Pass",
            ConfirmPassword = "Str0ng@Pass"
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Test]
    public void InvalidEmail_FailsValidation()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            FullName = "Test",
            Email = "not-an-email",
            Password = "Str0ng@Pass",
            ConfirmPassword = "Str0ng@Pass"
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Test]
    public void WeakPassword_FailsValidation()
    {
        // Arrange — missing uppercase, digit, special char
        var dto = new RegisterRequestDto
        {
            FullName = "Test",
            Email = "test@example.com",
            Password = "weak",
            ConfirmPassword = "weak"
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Test]
    public void PasswordMismatch_FailsValidation()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            FullName = "Test",
            Email = "test@example.com",
            Password = "Str0ng@Pass",
            ConfirmPassword = "DifferentPass"
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.ConfirmPassword);
    }

    [Test]
    public void FullNameTooLong_FailsValidation()
    {
        // Arrange
        var dto = new RegisterRequestDto
        {
            FullName = new string('x', 101),
            Email = "test@example.com",
            Password = "Str0ng@Pass",
            ConfirmPassword = "Str0ng@Pass"
        };

        // Act
        var result = _validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.FullName);
    }
}
