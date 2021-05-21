using System;
using System.Linq;
using AutoMapper;
using Core.Models;
using Core.Models.Dto;
using Core.Models.Result;

namespace Core.MapperProfiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<CreationUserDto, ApplicationUser>();
            CreateMap<ApplicationUser, UserResult>()
                .ForMember(dest => dest.Id,
                    opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.DeckIds,
                    opt => opt.MapFrom(src => src.Decks.Select(d => d.Id)));
        }
    }
}