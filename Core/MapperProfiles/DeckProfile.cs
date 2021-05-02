using System.Linq;
using AutoMapper;
using Core.Helpers;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.MapperProfiles
{
    public class DeckProfile : Profile
    {
        public DeckProfile()
        {
            CreateMap<CreationDeckDto, DeckDbo>()
                .ForMember(dest => dest.ImagePath,
                    opt => opt.MapFrom(src => DropboxHelper.UploadImage(src.Image)))
                .ForMember(dest => dest.Tags,
                    opt => opt.MapFrom(src => src.Tags.Select(tag => new TagDbo(tag))));
        }
    }
}