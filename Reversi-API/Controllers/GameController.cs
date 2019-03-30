using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Reversi.Game;
using ReversiAPI.Lobby;
using ReversiAPI.Model.ViewModel;
using ReversiAPI.Session;

namespace ReversiAPI.Controllers
{
    [Route("api/game")]
    [ApiController]
    public class GameController : ControllerBase
    {
        public GameController()
        {
        }

        // GET api/reversi
        [HttpGet]
        public ActionResult<Game> Get()
        {
            if (!Request.Headers.TryGetValue("session-id", out StringValues values)) return new BadRequestObjectResult("Missing header session-id");

            string sessionId = values;

            if (!UserSessionManager.UserSessions.TryGetValue(sessionId, out UserSession session))
                return new NotFoundObjectResult("No session registered"); //TODO const-ify this

            return new JsonResult(new GameInfo(session.GameSession.Lobby.Game));
        }

        // POST api/game
        [HttpPost]
        public ActionResult Post([FromForm] int scenarioId)
        {
            if (!Request.Headers.TryGetValue("session-id", out StringValues values)) return new BadRequestResult();
            string sessionId = values;

            if (Scenario.Scenarios.Length <= scenarioId) return new NotFoundResult();

            Scenario scenario = Scenario.Scenarios[scenarioId];


            UserSession userSession = UserSessionManager.UserSessions[sessionId];
            GameLobby lobby = userSession.GameSession.Lobby;

//            if (lobby.Game != null) return new ConflictObjectResult("Session already has game");

            lobby.Game = new Game(scenario);

            if (!lobby.RegisterUserPlayer(userSession.User, out Player player)) return new ConflictResult();

            userSession.GameSession.Player = player;

            return new OkObjectResult(new PlayerInfo(player));
        }
    }
}