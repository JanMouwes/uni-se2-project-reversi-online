using Microsoft.AspNetCore.Mvc;
using Reversi.Game;
using ReversiAPI.Session;
using ReversiAPI.Util;

namespace ReversiAPI.Controllers
{
    [Route("api/players")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        [HttpGet("current")]
        public ActionResult<Player> Current()
        {
            string sessionId = Request.Headers["session-id"];
            if (!GameSessionHelper.SessionExists(sessionId)) return new NotFoundResult();

            UserSession currentSession = UserSessionManager.UserSessions[sessionId];

            return currentSession.Player; //TODO player-viewmodel
        }
    }
}