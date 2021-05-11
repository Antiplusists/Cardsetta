using System.Linq;
using AutoMapper;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace UnitTests.MapperProfiles
{
    public class CreationDeckProfile : Profile
    {
        public CreationDeckProfile()
        {
            CreateMap<CreationDeckDto, DeckDbo>()
                .ForMember(dest => dest.ImagePath,
                    opt => opt.Ignore())
                .ForMember(dest => dest.Tags,
                    opt => opt.MapFrom(src => src.Tags.Select(tag => new TagDbo(tag)).ToList()));
        }
    }
}