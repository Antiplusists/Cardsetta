using AutoMapper;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Models.Results;

namespace Core.MapperProfiles
{
    public class CardProfile : Profile
    {
        public CardProfile()
        {
            CreateMap<CreationCardDto, CardDbo>();
            CreateMap<UpdateCardDto, CardDbo>();
            CreateMap<CardDbo, UpdateCardDto>();
            CreateMap<CardDbo, CardResult>();
        }
    }
}