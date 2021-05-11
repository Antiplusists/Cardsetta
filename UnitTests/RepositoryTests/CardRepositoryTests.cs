using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Core.Data;
using Core.Models;
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
        private ICardRepository _cardRepository;
        private IMapper _mapper;

        [OneTimeSetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            _cardRepository = new CardRepository(new ApplicationDbContext(options, new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions())));
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(typeof(CreationCardProfile))));
        }
        public static IEnumerable<TestCaseData> CreationCards
        {
            get
            {
                yield return new TestCaseData(new CreationCardDto{Answer = "some answer", Question = "text question", Type = CardType.Text});
                yield return new TestCaseData(new CreationCardDto{Answer = "some answer", Question = "photo question", Type = CardType.Photo});
                yield return new TestCaseData(new CreationCardDto{Answer = "some answer", Question = "mixed question", Type = CardType.Mixed});
            }
        }

        [TestCaseSource(nameof(CreationCards))]
        public async Task IsCreationCardWithoutImageSuccessful(CreationCardDto dto)
        {
            var dbo = _mapper.Map<CardDbo>(dto);
            var result = await _cardRepository.AddAsync(dbo);
            var found = await _cardRepository.FindAsync(result.Id);
            
            result.Answer.Should().BeEquivalentTo(dbo.Answer);
            result.Question.Should().BeEquivalentTo(dbo.Question);
            result.Type.Should().BeEquivalentTo(dbo.Type);
            result.ImagePath.Should().BeNull();
            
            found.Should().Be(result);
        }
    }
}