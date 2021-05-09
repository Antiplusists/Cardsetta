using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dbo;
using Core.Repositories.Abstracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

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
    }
}