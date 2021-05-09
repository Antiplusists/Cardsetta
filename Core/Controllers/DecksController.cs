using System.Collections.Generic;
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
        public async Task<ActionResult<PageListResult<DeckResult>>> GetDecks([FromQuery]int pageNumber = 1, [FromQuery]int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
                return BadRequest();
            
            var page = await deckRepo.GetPage(pageNumber, pageSize);
            var result = new PageListResult<DeckResult>(mapper.Map<List<DeckDbo>, List<DeckResult>>(page), page.TotalCount,
                page.CurrentPage, page.PageSize);
            
            return Ok(result);
        }
    }
}