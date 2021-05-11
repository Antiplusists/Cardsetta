using AutoMapper;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace UnitTests.MapperProfiles
{
    public class CreationCardProfile : Profile
    {
        public CreationCardProfile()
        {
            CreateMap<CreationCardDto, CardDbo>()
                .ForMember(dest => dest.ImagePath, opt => opt.Ignore());
        }
    }
}