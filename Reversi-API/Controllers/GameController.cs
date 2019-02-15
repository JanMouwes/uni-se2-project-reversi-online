using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Reversi.Board;
using Reversi.Game;
using Reversi.GameEntities;
using Reversi.Util;
using ReversiAPI.Util;
using SessionExtensions;

namespace ReversiAPI.Controllers
{
    [Route("api/game")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private GameSessionHelper gameSessionHelper;

        public GameController()
        {
            gameSessionHelper = new GameSessionHelper(this);
        }

        // GET api/reversi
        [HttpGet]
        public ActionResult<BoardInfo> Get()
        {
            return new JsonResult(new BoardInfo(new Board(8, 8)));
        }

        // GET api/reversi/1,2
        [HttpGet("{coordsString}")]
        public ActionResult Get(string coordsString)
        {
            if (!Regex.IsMatch(coordsString, "^([0-9],[0-9])$"))
                return new BadRequestResult();

            char[] charArray = coordsString.ToCharArray();

            Coords cellCoords = new Coords()
            {
                X = int.Parse(charArray[0].ToString()),
                Y = int.Parse(charArray[2].ToString())
            };

            return new JsonResult(gameSessionHelper.CurrentGame.Board.CellFromCoordinates(cellCoords));
        }

        // POST api/move
        [HttpPost]
        public ActionResult Post([FromForm] int scenarioId)
        {
            if (Scenario.Scenarios.Length <= scenarioId) return new NotFoundResult();

            Scenario scenario = Scenario.Scenarios[scenarioId];

            try
            {
                gameSessionHelper.CurrentGame = new Game(scenario);
            }
            catch (ArgumentException e)
            {
                return new ConflictResult();
            }

            gameSessionHelper.SessionPlayer = scenario.Players.First();

            Response.Cookies.Append("SessionId", HttpContext.Session.Id);

            return new OkObjectResult(HttpContext.Session); //TODO return GameLobby-id
        }
    }
}