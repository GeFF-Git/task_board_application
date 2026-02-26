using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Core.DTOs;
using TaskBoard.Core.Interfaces.Repositories;

namespace TaskBoard.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetUsers()
    {
        var users = await _userRepository.GetAll().ToListAsync();
        var userDtos = users.Select(UserDto.FromEntity);
        
        return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(userDtos));
    }
}
