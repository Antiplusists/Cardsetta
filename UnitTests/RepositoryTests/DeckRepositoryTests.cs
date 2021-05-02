using System;
using System.Collections.Generic;
using System.Linq;
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
    public class DeckRepositoryTests
    {
        private static readonly string[] Tags = {"language", "cars", "countries", "it", "seas", "series"};
        
        private IDeckRepository _deckRepository;
        private ICardRepository _cardRepository;
        private ITagRepository _tagRepository;
        private IMapper _mapper;

        [OneTimeSetUp]
        public async Task OneTimeSetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            var dbContext = new ApplicationDbContext(options,
                new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions()));
            _tagRepository = new TagRepository(dbContext);
            _cardRepository = new CardRepository(dbContext);
            _deckRepository = new DeckRepository(dbContext, _cardRepository);
            
            await InitTagRepository();
            
            var mapperConfiguration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(typeof(CreationCardProfile));
                cfg.AddProfile(typeof(CreationDeckProfile));
            });
            
            _mapper = new Mapper(mapperConfiguration);
        }

        private async Task InitTagRepository()
        {
            foreach (var tag in Tags)
            {
                await _tagRepository.AddAsync(tag);
            }
        }
        
        public static IEnumerable<TestCaseData> CreationDecks
        {
            get
            {
                yield return new TestCaseData(
                    new CreationDeckDto
                    {
                        Name = "deck1",
                        Description = "desc1"
                    });
                yield return new TestCaseData(
                    new CreationDeckDto
                    {
                        Name = "some name",
                        Tags = new() {"it"}
                    });
                yield return new TestCaseData(
                    new CreationDeckDto
                    {
                        Name = "some name",
                        Tags = new(Tags)
                    });
                yield return new TestCaseData(
                    new CreationDeckDto
                    {
                        Name = "some name",
                        Tags = new() {"unexisted"}
                    });
            }
        }

        [TestCaseSource(nameof(CreationDecks))]
        public async Task IsDeckCreationCorrect(CreationDeckDto dto)
        {
            var dbo = _mapper.Map(dto, new DeckDbo {AuthorId = Guid.NewGuid()});
            var result = await _deckRepository.AddAsync(dbo);
            var found = await _deckRepository.FindAsync(result.Id);
            
            result.AuthorId.Should().Be(dbo.AuthorId);
            result.Description.Should().BeEquivalentTo(dbo.Description);
            result.Name.Should().BeEquivalentTo(dbo.Name);
            result.Cards.Should().BeEmpty();
            result.ImagePath.Should().BeEquivalentTo(dbo.ImagePath);
            result.Tags.Should().BeEquivalentTo(dbo.Tags);
            found.Should().Be(result);
        }

        public static IEnumerable<TestCaseData> AdditionCard
        {
            get
            {
                yield return new TestCaseData(new List<CreationCardDto>());
                yield return new TestCaseData(new List<CreationCardDto>()
                {
                    new CreationCardDto
                    {
                        Answer = "answer",
                        Question = "question",
                        Type = CardType.Text
                    }
                });
                yield return new TestCaseData(
                    new List<CreationCardDto>
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
                yield return new TestCaseData(new List<CreationCardDto>()
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
        public async Task IsCardAdditiongCorrect(List<CreationCardDto> cardDtos)
        {
            var deck = await _deckRepository.AddAsync(new DeckDbo());
            var cards = new List<CardDbo>();
            foreach (var dto in cardDtos)
            {
                var card = _mapper.Map<CardDbo>(dto);
                await _deckRepository.AddCard(deck.Id, card);
                cards.Add(card);
            }
            deck.Cards.Count.Should().Be(cards.Count);
            deck.Cards.Should().BeEquivalentTo(cards);
        }

        [Test]
        public async Task IsCardRemovingCorrect()
        {
            var deck = await _deckRepository.AddAsync(new DeckDbo());
            var card = await _deckRepository.AddCard(deck.Id, new CardDbo());
            deck.Cards.Should().NotBeEmpty();
            (await _deckRepository.RemoveCard(deck.Id, card.Id)).Should().BeEquivalentTo(card);
            deck.Cards.Should().BeEmpty();
        }

        [Test]
        public async Task IsTagsAdditionCorrect()
        {
            var deck = await _deckRepository.AddAsync(new DeckDbo());
            var tags = new[] {"newtag1", "newtag2", "newtag3"};
            Assert.IsTrue(await _deckRepository.AddTags(deck.Id, tags));
            deck.Tags.Should().NotBeEmpty();
            deck.Tags.Select(tag => tag.Tag).Should().BeEquivalentTo(tags);
        }

        [Test]
        public async Task IsTagsRemovingCorrect()
        {
            var deck = await _deckRepository.AddAsync(new DeckDbo());
            var tags = new[] {"newtag1", "newtag2", "newtag3"};
            Assert.IsTrue(await _deckRepository.AddTags(deck.Id, tags));
            deck.Tags.Should().NotBeEmpty();
            deck.Tags.Select(tag => tag.Tag).Should().BeEquivalentTo(tags);
            Assert.IsTrue(await _deckRepository.RemoveTags(deck.Id, tags));
            deck.Tags.Should().BeEmpty();
        }
    }
}