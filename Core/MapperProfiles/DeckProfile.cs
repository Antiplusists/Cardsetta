using System.Linq;
using AutoMapper;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;

namespace Core.MapperProfiles
{
    public class DeckProfile : Profile
    {
        public DeckProfile(ITagRepository tagRepo)
        {
            CreateMap<CreationDeckDto, DeckDbo>()
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src
                        => src.Tags.Select(tag => new TagDbo(tag))));
            
            CreateMap<UpdateDeckDto, DeckDbo>()
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(tags
                        => tags.Tags
                            .AsParallel()
                            .Select(tag => tagRepo.FindAsync(tag).Result ?? new TagDbo(tag))));

            CreateMap<DeckDbo, UpdateDeckDto>()
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src
                    => src.Tags.Select(tag => tag.Tag)));
        }
    }
}