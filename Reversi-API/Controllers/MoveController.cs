using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Reversi.Game;
using ReversiAPI.Model;
using ReversiAPI.Model.ViewModel;
using ReversiAPI.Session;
using ReversiAPI.Util;

namespace ReversiAPI.Controllers
{
    [Route("api/move")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        // GET api/move
        [HttpGet]
        public ActionResult<IEnumerable<Move>> Get()
        {
            return new JsonResult(new LinkedList<Move>()); //TODO return all moves registered
        }

        // GET api/move/5
        [HttpGet("{amount}")]
        public ActionResult<IEnumerable<Move>> Get(int amount)
        {
            return new LinkedList<Move>(); //TODO return x amount moves back
        }

        // POST api/move
        [HttpPost]
        public ActionResult Post([FromForm] MoveDTO moveObject)
        {
            if (!Request.Headers.TryGetValue("session-id", out StringValues values)) return new BadRequestResult();

            if (!GameSessionHelper.SessionExists(values.ToString())) return new NotFoundResult();

            GameSessionHelper sessionHelper = new GameSessionHelper(values.ToString());

            if (!sessionHelper.SessionPlayerIsCurrentPlayer) return new ConflictObjectResult("Not your turn"); //TODO ReversiRequestError-class?

            Move move = moveObject.ToMove;

            if (!sessionHelper.CurrentGame.TryMakeMove(sessionHelper.SessionPlayer, move, out List<string> errors))
            {
                return new ConflictObjectResult(errors);
            }

            sessionHelper.CurrentGame.NextPlayer();

            return new OkResult(); //TODO register move
        }
    }
}