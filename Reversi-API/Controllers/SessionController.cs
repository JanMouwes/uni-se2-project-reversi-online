using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Reversi.Game;
using ReversiAPI.Lobby;
using ReversiAPI.Session;

namespace ReversiAPI.Controllers
{
    [Route("api/session")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        // GET api/move
        [HttpGet]
        public ActionResult<object> Get()
        {
            string sessionId = HttpContext.Session.Id;

            UserSessionManager.OpenSession(sessionId);

            return new JsonResult(new
            {
                sessionId = sessionId
            });
        }

        [HttpGet("updates")]
        public ActionResult<UpdateType[]> GetUpdates()
        {
            if (!Request.Headers.ContainsKey("session-id")) return new BadRequestResult();
            string sessionId = Request.Headers["session-id"];

            if (!UserSessionManager.SessionExists(sessionId)) return new NotFoundResult();

            UserSession userSession = UserSessionManager.UserSessions[sessionId];

            GameSession gameSession = userSession.GameSession;

            if (gameSession == null ||
                !UpdateManager.GameSessionUpdates.ContainsKey(gameSession) ||
                !UpdateManager.GameSessionUpdates[gameSession].Any()) return new UpdateType[0];

            UpdateType[] updates = UpdateManager.GameSessionUpdates[gameSession].ToArray();

            UpdateManager.GameSessionUpdates[gameSession].Clear();

            return updates;
        }
    }
}