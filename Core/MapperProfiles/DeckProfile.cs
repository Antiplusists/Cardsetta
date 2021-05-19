using System;
using System.Linq;
using AutoMapper;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Models.Results;

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
            CreateMap<DeckDbo, DeckResult>()
                .ForMember(dest => dest.AuthorId, opt 
                    => opt.MapFrom(src => Guid.Parse(src.Author.Id)))
                .ForMember(dest => dest.Tags, opt 
                    => opt.MapFrom(src => src.Tags.Select(tagDbo => tagDbo.Tag)));
        }
    }
}