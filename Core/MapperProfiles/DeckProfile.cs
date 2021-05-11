using System.Linq;
using AutoMapper;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.MapperProfiles
{
    public class DeckProfile : Profile
    {
        public DeckProfile()
        {
            CreateMap<CreationDeckDto, DeckDbo>()
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src
                        => src.Tags.Select(tag => new TagDbo(tag))));
            CreateMap<UpdateDeckDto, DeckDbo>();
            CreateMap<DeckDbo, UpdateDeckDto>();
        }
    }
}