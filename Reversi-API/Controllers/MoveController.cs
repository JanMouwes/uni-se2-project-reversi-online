using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Reversi.Game;
using ReversiAPI.Model;
using ReversiAPI.Util;

namespace ReversiAPI.Controllers
{
    [Route("api/move")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly GameSessionHelper gameSessionHelper;

        public MoveController()
        {
            gameSessionHelper = new GameSessionHelper(this);
        }

        // GET api/move
        [HttpGet]
        public ActionResult<IEnumerable<Move>> Get()
        {
            return new JsonResult(new List<Move>()); //TODO return all moves registered
        }

        // GET api/move/5
        [HttpGet("{amount}")]
        public ActionResult<IEnumerable<Move>> Get(int amount)
        {
            return new List<Move>(); //TODO return x amount moves back
        }

        // POST api/move
        [HttpPost]
        public ActionResult Post([FromForm] MoveDTO moveObject)
        {
            if (!gameSessionHelper.SessionPlayerIsCurrentPlayer) return new ConflictResult();

            Move move = moveObject.ToMove;

            if (!gameSessionHelper.CurrentGame.TryMakeMove(gameSessionHelper.SessionPlayer, move, out List<string> errors))
            {
                return new ConflictObjectResult(errors);
            }
            return new OkResult(); //TODO register move
        }
    }
}