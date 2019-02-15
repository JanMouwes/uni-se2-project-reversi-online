using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Reversi.Game;

namespace Reversi_Online.Controllers
{
    [Route("api/move")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        // GET api/move/1,2
        [HttpGet("{coordsString}")]
        public ActionResult<IEnumerable<Move>> Get()
        {
            return new List<Move>(); //TODO return all moves registered
        }

        // GET api/move/1,2
        [HttpGet("{coordsString}")]
        public ActionResult<IEnumerable<Move>> Get(int amountOfMoves)
        {
            return new List<Move>(); //TODO return x amount moves back
        }

        // POST api/move
        [HttpPost]
        public ActionResult<string> Post([FromBody] Move value)
        {
            return $"{value.From}, {value.To}"; //TODO execute and register move
        }
    }
}