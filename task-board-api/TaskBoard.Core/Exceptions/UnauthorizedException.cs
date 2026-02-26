namespace TaskBoard.Core.Exceptions;

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Access denied") : base(message, 403) { }
}
