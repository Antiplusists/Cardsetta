using System;
using System.Linq;
using System.Threading.Tasks;
using Core.Data;
using Core.Models;
using Core.Models.Dbo;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Core.Repositories.Realizations
{
    public class DeckRepository : RepositoryBase<Guid, DeckDbo, DeckDbo, DeckDbo>, IDeckRepository
    {
        private readonly ICardRepository cardRepo;

        public DeckRepository(ApplicationDbContext dbContext, ICardRepository cardRepo) : base(dbContext)
        {
            this.cardRepo = cardRepo;
        }

        public override async Task<DeckDbo?> FindAsync(Guid id)
        {
            var deck = await DbContext.Decks.FindAsync(id);
            if (deck is null) return null;
            
            var entry = DbContext.Entry(deck);
            await entry.Reference(d => d.Author).LoadAsync();
            await entry.Collection(d => d.Cards).LoadAsync();
            await entry.Collection(d => d.Tags).LoadAsync();
            return deck;
        }

        public override async Task<DeckDbo> AddAsync(DeckDbo dbo)
        {
            dbo.Tags = dbo.Tags.AsParallel().Select(tag => DbContext.Tags.Find(tag.Tag) ?? tag).ToHashSet();
            
            var result = await DbContext.Decks.AddAsync(dbo);

            if (result is not {State: EntityState.Added})
                throw new AggregateException();

            await DbContext.SaveChangesAsync();
            
            return result.Entity!;
        }

        public override async Task<bool> RemoveAsync(Guid id)
        {
            var deck = (await FindAsync(id))!;
            var result = DbContext.Decks.Remove(deck);

            if (result is not {State: EntityState.Deleted})
                return false;
                
            await DbContext.SaveChangesAsync();

            return result is {State: EntityState.Detached};
        }

        public override async Task<DeckDbo> UpdateAsync(Guid id, DeckDbo dbo)
        {
            dbo.Id = id;
            var result = DbContext.Decks.Update(dbo);

            if (result is not {State: EntityState.Modified})
                throw new OperationException("Failed to update entity");
            
            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Unchanged})
                return result.Entity!;
            
            throw new OperationException("Failed to update entity");
        }
        
        
        public async Task<CardDbo?> AddCard(Guid deckId, CardDbo dbo)
        {
            var deck = await FindAsync(deckId);

            if (deck is null) return null;

            CardDbo? card;
            
            if (dbo.Id == Guid.Empty)
            {
                card = await cardRepo.AddAsync(dbo);
            }
            else
            {
                card = await cardRepo.FindAsync(dbo.Id);
            }

            if (card is null) return null;
            
            deck.Cards.Add(card);
            
            await DbContext.SaveChangesAsync();

            return card;
        }

        public async Task<CardDbo?> RemoveCard(Guid deckId, Guid cardId)
        {
            var deck = await FindAsync(deckId);
            
            var card = deck?.Cards.Find(cardDbo => cardDbo.Id == cardId);
            
            if (card is null) return null;
            
            deck!.Cards.Remove(card);

            return card;
        }

        public async Task<bool> AddTags(Guid deckId, params string[] tags)
        {
            var deck = await FindAsync(deckId);

            if (deck is null) return false;
            
            foreach (var tag in tags)
            {
                var tagDbo = await DbContext.Tags.FindAsync(tag);
                deck.Tags.Add(tagDbo ?? new TagDbo(tag));
            }

            return await DbContext.SaveChangesAsync() != 0;
        }

        public async Task<bool> RemoveTags(Guid deckId, params string[] tags)
        {
            var deck = await FindAsync(deckId);

            if (deck is null) return false;

            foreach (var tag in tags)
            {
                deck.Tags.RemoveWhere(tagDbo => tagDbo.Tag == tag);
            }

            return await DbContext.SaveChangesAsync() != 0;
        }

        public async Task<PageList<DeckDbo>> GetPageByTags(int pageNumber, int pageSize, params string[] tags)
        {
            var neededDecks = DbContext.Tags
                .Where(tag => tags.Contains(tag.Tag))
                .Include(tag => tag.Decks)
                .SelectMany(tag => tag.Decks)
                .Distinct();

            var page = neededDecks
                .Include(deck => deck.Author)
                .OrderBy(deck => deck.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            foreach (var deckDbo in page)
            {
                await DbContext.Entry(deckDbo).Collection(d => d.Tags).LoadAsync();
            }

            return new PageList<DeckDbo>(await page.ToListAsync(), await neededDecks.LongCountAsync(),
                pageNumber, pageSize);
        }

        public async Task<PageList<DeckDbo>> GetPage(int pageNumber, int pageSize)
        {
            var page = DbContext.Decks
                .OrderBy(deck => deck.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(deck => deck.Author)
                .Include(deck => deck.Tags);
            
            return new PageList<DeckDbo>(await page.ToListAsync(), await DbContext.Decks.LongCountAsync(),
                pageNumber, pageSize);
        }

        public async Task<PageList<DeckDbo>> GetPageByAuthorId(int pageNumber, int pageSize, Guid authorId)
        {
            var author = await DbContext.Users.FindAsync(authorId.ToString());

            if (author is null)
                throw new ArgumentException($"User with id: {authorId} doesn't exists");
            
            var page = author.Decks
                .AsQueryable()
                .OrderBy(deck => deck.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(deck => deck.Author);

            return new PageList<DeckDbo>(await page.ToListAsync(), await author.Decks.AsQueryable().LongCountAsync(), pageNumber, pageSize);
        }

        public async Task<DeckDbo> UpdateAsync(DeckDbo dbo)
        {
            return await UpdateAsync(dbo.Id, dbo);
        }
    }
}