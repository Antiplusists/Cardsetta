using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dbo;
using Core.Models.Results;
using Core.Repositories.Abstracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Core.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    public class DecksController : Controller
    {
        private readonly IDeckRepository deckRepo;
        private readonly IMapper mapper;

        public DecksController(IDeckRepository deckRepo, IMapper mapper)
        {
            this.deckRepo = deckRepo;
            this.mapper = mapper;
        }
        
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PageList<DeckResult>>> GetDecksByTags([FromQuery] string[] tags,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
                return BadRequest("Page number and page size can not be less than 1");
            if (!tags.All(tag => !string.IsNullOrEmpty(tag) && tag.All(char.IsLetterOrDigit)))
                return BadRequest("Tags should contains only letters and digits");
            if (!tags.All(tag => tag.All(char.IsLower)))
                return BadRequest("Tags should be in lower case");
            if (!tags.All(tag => tag.Length <= 30))
                return BadRequest("Tags should not be bigger than 30 symbols");
            
            var page = tags.Length > 0 
                ? await deckRepo.GetPageByTags(pageNumber, pageSize, tags) 
                : await deckRepo.GetPage(pageNumber, pageSize);
            
            var result = new PageListResult<DeckResult>(mapper.Map<List<DeckDbo>, List<DeckResult>>(page), page.TotalCount,
                page.CurrentPage, page.PageSize);
            
            return Ok(result);
        }
    }
}