using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

namespace UnitTests.RepositoryTests
{
    [TestFixture]
    public class DeckRepositoryTests
    {
        private IDeckRepository _deckRepository;

        [OneTimeSetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            _deckRepository = new DeckRepository(new ApplicationDbContext(options,
                new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions())));
        }

        public static IEnumerable<TestCaseData> CreationDecks
        {
            get
            {
                yield return new TestCaseData(new CreationDeckDto {AuthorId = Guid.NewGuid(), Name = "some name"});
                yield return new TestCaseData(new CreationDeckDto
                {
                    AuthorId = Guid.NewGuid(),
                    Name = "some name",
                    Cards = new List<CardDbo>
                        {new() {Answer = "asd", Id = Guid.NewGuid(), Question = "some quest", Type = CardType.Text}}
                });
                yield return new TestCaseData(new CreationDeckDto
                {
                    AuthorId = Guid.NewGuid(),
                    Name = "some name",
                    Cards = new List<CardDbo>
                    {
                        new() {Answer = "asd", Id = Guid.NewGuid(), Question = "some quest", Type = CardType.Text},
                        new() {Answer = "asd", Id = Guid.NewGuid(), Question = "some quest", Type = CardType.Text}
                    }
                });
            }
        }

        [TestCaseSource(nameof(CreationDecks))]
        public async Task CreationCard(CreationDeckDto dto)
        {
            var result = await _deckRepository.AddAsync(dto);
            var found = await _deckRepository.FindAsync(result.Id);

            result.AuthorId.Should().Be(dto.AuthorId);
            result.Name.Should().BeEquivalentTo(dto.Name);
            result.Cards.Should().BeEquivalentTo(dto.Cards);

            found.Should().Be(result);
        }
    }
}