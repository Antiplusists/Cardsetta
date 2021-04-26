using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Data;
using Core.Models;
using Core.Models.Dbo;
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
    public class DeckRepositoryTests
    {
        private static readonly string[] Tags = {"language", "cars", "countries", "it", "seas", "series"};
        
        private IDeckRepository _deckRepository;
        private ICardRepository _cardRepository;
        private ITagRepository _tagRepository;

        [OneTimeSetUp]
        public async Task OneTimeSetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            _tagRepository = new TagRepository(new ApplicationDbContext(options,
                new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions())));
            await InitTagRepository();
        }

        private async Task InitTagRepository()
        {
            foreach (var tag in Tags)
            {
                await _tagRepository.AddAsync(tag);
            }
        }
        
        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            _deckRepository = new DeckRepository(new ApplicationDbContext(options,
                new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions())));
            _cardRepository = new CardRepository(new ApplicationDbContext(options,
                new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions())));

        }

        public static IEnumerable<TestCaseData> CreationDecks
        {
            get
            {
                yield return new TestCaseData(
                    new NewDeckEntity(Guid.NewGuid(), "https://example.com/brick", new CreationDeckDto
                    {
                        Name = "deck1",
                        Description = "desc1"
                    }));
                yield return new TestCaseData(
                    new NewDeckEntity(Guid.NewGuid(), "http://www.example.org/bird/bead",new CreationDeckDto
                {
                    Name = "some name",
                    Tags = new() {"it"}
                }));
                yield return new TestCaseData(
                    new NewDeckEntity(Guid.NewGuid(), null, new CreationDeckDto
                {
                    Name = "some name",
                    Tags = new (Tags)
                }));
            }
        }

        [TestCaseSource(nameof(CreationDecks))]
        public async Task CreationDeck(NewDeckEntity entity)
        {
            var result = await _deckRepository.AddAsync(entity);
            var found = await _deckRepository.FindAsync(result.Id);
            
            result.AuthorId.Should().Be(entity.AuthorId);
            result.Description.Should().BeEquivalentTo(entity.Description);
            result.Name.Should().BeEquivalentTo(entity.Name);
            result.Cards.Should().BeEmpty();
            result.ImagePath.Should().BeEquivalentTo(entity.ImagePath);
            result.Tags.Select(tag => tag.Tag).Should().BeEquivalentTo(entity.Tags);
            found.Should().Be(result);
        }

        public static IEnumerable<TestCaseData> AdditionCard
        {
            get
            {
                yield return new TestCaseData(
                    new NewDeckEntity(Guid.NewGuid(), null, new()), new CreationCardDto[0]);
                yield return new TestCaseData(
                    new NewDeckEntity(Guid.NewGuid(), null, new()),
                    new[]
                    {
                        new CreationCardDto 
                        {
                            Answer = "answer",
                            Question = "question",
                            Type = CardType.Text
                        }
                    });
                yield return new TestCaseData(
                    new NewDeckEntity(Guid.NewGuid(), null, new()),
                    new[]
                    {
                        new CreationCardDto
                        {
                            Answer = "answer1",
                            Question = "question1",
                            Type = CardType.Photo
                        },
                        new CreationCardDto
                        {
                            Answer = "answer2",
                            Question = "question2",
                            Type = CardType.Text
                        }
                    });
                yield return new TestCaseData(
                    new NewDeckEntity(Guid.NewGuid(), null, new()),
                    new[]
                    {
                        new CreationCardDto
                        {
                            Answer = "answer0",
                            Question = "questio0",
                            Type = CardType.Text
                        },
                        new CreationCardDto
                        {
                            Answer = "answer1",
                            Question = "question1",
                            Type = CardType.Mixed
                        },
                        new CreationCardDto
                        {
                            Answer = "answer2",
                            Question = "question2",
                            Type = CardType.Text
                        },
                        new CreationCardDto
                        {
                            Answer = "answer3",
                            Question = "question3",
                            Type = CardType.Photo
                        },
                        new CreationCardDto
                        {
                            Answer = "answer4",
                            Question = "question4",
                            Type = CardType.Photo
                        }
                    });
            }
        }

        [TestCaseSource(nameof(AdditionCard))]
        public async Task AddCards(NewDeckEntity entity, CreationCardDto[] cardDtos)
        {
            var deck = await _deckRepository.AddAsync(entity);
            var cards = new List<CardDbo>();
            foreach (var dto in cardDtos)
            {
                var card = await _cardRepository.AddAsync(new CreationCardEntity(null, dto));
                Assert.IsTrue(await _deckRepository.AddCard(deck.Id, card));
                cards.Add(card);
            }
            deck.Cards.Count.Should().Be(cards.Count);
            deck.Cards.Should().BeEquivalentTo(cards);
        }
    }
}