using AutoMapper;
using TaskBoard.Core.DTOs.Tasks;
using TaskBoard.Core.Entities;

namespace TaskBoard.Infrastructure.Mappings;

public class TaskProfile : Profile
{
    public TaskProfile()
    {
        CreateMap<TaskItem, TaskDto>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.ExternalId ?? string.Empty))
            .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString().ToLower()))
            .ForMember(dest => dest.Status, opt => opt.Ignore()) // Set in service based on column name
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.DueDate != null ? src.DueDate.Value.ToString("yyyy-MM-dd") : ""))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.ToString("o")));

        CreateMap<CreateTaskDto, TaskItem>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.ExternalId, opt => opt.Ignore())
            .ForMember(dest => dest.Column, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());

        CreateMap<UpdateTaskDto, TaskItem>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
