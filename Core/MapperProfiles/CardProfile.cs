using AutoMapper;
using Core.Helpers;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.MapperProfiles
{
    public class CardProfile : Profile
    {
        public CardProfile()
        {
            CreateMap<CreationCardDto, CardDbo>()
                .ForMember(dest => dest.ImagePath,
                    opt => opt.MapFrom(src => DropboxHelper.UploadImage(src.Image)));
        }
    }
}