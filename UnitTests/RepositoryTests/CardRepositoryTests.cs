using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Data;
using Core.Models;
using Core.Models.Dto;
using Core.Models.Entities;
using Core.Repositories.Abstracts;
using Core.Repositories.Realizations;
using FluentAssertions;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace UnitTests.RepositoryTests
{
    [TestFixture]
    public class CardRepositoryTests
    {
        private ICardRepository _cardRepository;

        [OneTimeSetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            _cardRepository = new CardRepository(new ApplicationDbContext(options, new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions())));
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
        public async Task CreationCard(CreationCardDto dto)
        {
            var result = await _cardRepository.AddAsync(new CreationCardEntity(null, dto));
            var found = await _cardRepository.FindAsync(result.Id);
            
            result.Answer.Should().BeEquivalentTo(dto.Answer);
            result.Question.Should().BeEquivalentTo(dto.Question);
            result.Type.Should().BeEquivalentTo(dto.Type);
            result.ImagePath.Should().BeNull();
            
            found.Should().Be(result);
        }
    }
}