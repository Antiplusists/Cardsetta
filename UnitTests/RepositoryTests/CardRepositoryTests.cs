using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Core.Data;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;
using Core.Repositories.Realizations;
using FluentAssertions;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using UnitTests.MapperProfiles;

namespace UnitTests.RepositoryTests
{
    [TestFixture]
    public class CardRepositoryTests
    {
        private ICardRepository cardRepository;
        private IMapper mapper;

        [OneTimeSetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            cardRepository = new CardRepository(new ApplicationDbContext(options, new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions())));
            mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(typeof(CreationCardProfile))));
        }
        public static IEnumerable<TestCaseData> CreationCards
        {
            get
            {
                yield return new TestCaseData(new CreationCardDto{Answer = "some answer", Question = "text question"});
                yield return new TestCaseData(new CreationCardDto{Answer = "some answer", Question = "photo question"});
                yield return new TestCaseData(new CreationCardDto{Answer = "some answer", Question = "mixed question"});
            }
        }

        [TestCaseSource(nameof(CreationCards))]
        public async Task IsCreationCardWithoutImageSuccessful(CreationCardDto dto)
        {
            var dbo = mapper.Map<CardDbo>(dto);
            var result = await cardRepository.AddAsync(dbo);
            var found = await cardRepository.FindAsync(result.Id);
            
            result.Answer.Should().BeEquivalentTo(dbo.Answer);
            result.Question.Should().BeEquivalentTo(dbo.Question);
            result.ImagePath.Should().BeNull();
            
            found.Should().Be(result);
        }
    }
}