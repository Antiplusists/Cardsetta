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
        
        private IDeckRepository deckRepository;
        private ICardRepository cardRepository;
        private ITagRepository tagRepository;
        private IMapper mapper;
        private ApplicationUser user;

        [OneTimeSetUp]
        public async Task OneTimeSetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;
            var dbContext = new ApplicationDbContext(options,
                new OptionsWrapper<OperationalStoreOptions>(new OperationalStoreOptions()));
            tagRepository = new TagRepository(dbContext);
            cardRepository = new CardRepository(dbContext);
            deckRepository = new DeckRepository(dbContext, cardRepository);
            user = dbContext.Users.Add(new ApplicationUser() {UserName = "TestUser"}).Entity;
            await InitTagRepository();
            
            var mapperConfiguration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(typeof(CreationCardProfile));
                cfg.AddProfile(typeof(CreationDeckProfile));
            });
            
            mapper = new Mapper(mapperConfiguration);
        }

        private async Task InitTagRepository()
        {
            foreach (var tag in Tags)
            {
                await tagRepository.AddAsync(tag);
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
            var dbo = mapper.Map(dto, new DeckDbo {Author = user});
            var result = await deckRepository.AddAsync(dbo);
            var found = await deckRepository.FindAsync(result.Id);
            
            result.Author.Should().BeEquivalentTo(user);
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
                    }
                });
                yield return new TestCaseData(
                    new List<CreationCardDto>
                    {
                        new CreationCardDto
                        {
                            Answer = "answer1",
                            Question = "question1",
                        },
                        new CreationCardDto
                        {
                            Answer = "answer2",
                            Question = "question2",
                        }
                    });
                yield return new TestCaseData(new List<CreationCardDto>()
                {
                    new CreationCardDto
                    {
                        Answer = "answer0",
                        Question = "questio0",
                    },
                    new CreationCardDto
                    {
                        Answer = "answer1",
                        Question = "question1",
                    },
                    new CreationCardDto
                    {
                        Answer = "answer2",
                        Question = "question2",
                    },
                    new CreationCardDto
                    {
                        Answer = "answer3",
                        Question = "question3",
                    },
                    new CreationCardDto
                    {
                        Answer = "answer4",
                        Question = "question4",
                    }
                });
            }
        }

        [TestCaseSource(nameof(AdditionCard))]
        public async Task IsCardAdditiongCorrect(List<CreationCardDto> cardDtos)
        {
            var deck = await deckRepository.AddAsync(new DeckDbo());
            var cards = new List<CardDbo>();
            foreach (var dto in cardDtos)
            {
                var card = mapper.Map<CardDbo>(dto);
                await deckRepository.AddCard(deck.Id, card);
                cards.Add(card);
            }
            deck.Cards.Count.Should().Be(cards.Count);
            deck.Cards.Should().BeEquivalentTo(cards);
        }

        [Test]
        public async Task IsCardRemovingCorrect()
        {
            var deck = await deckRepository.AddAsync(new DeckDbo());
            var card = await deckRepository.AddCard(deck.Id, new CardDbo());
            deck.Cards.Should().NotBeEmpty();
            (await deckRepository.RemoveCard(deck.Id, card!.Id)).Should().BeEquivalentTo(card);
            deck.Cards.Should().BeEmpty();
        }

        [Test]
        public async Task IsTagsAdditionCorrect()
        {
            var deck = await deckRepository.AddAsync(new DeckDbo());
            var tags = new[] {"newtag1", "newtag2", "newtag3"};
            Assert.IsTrue(await deckRepository.AddTags(deck.Id, tags));
            deck.Tags.Should().NotBeEmpty();
            deck.Tags.Select(tag => tag.Tag).Should().BeEquivalentTo(tags);
        }

        [Test]
        public async Task IsTagsRemovingCorrect()
        {
            var deck = await deckRepository.AddAsync(new DeckDbo());
            var tags = new[] {"newtag1", "newtag2", "newtag3"};
            Assert.IsTrue(await deckRepository.AddTags(deck.Id, tags));
            deck.Tags.Should().NotBeEmpty();
            deck.Tags.Select(tag => tag.Tag).Should().BeEquivalentTo(tags);
            Assert.IsTrue(await deckRepository.RemoveTags(deck.Id, tags));
            deck.Tags.Should().BeEmpty();
        }
    }
}