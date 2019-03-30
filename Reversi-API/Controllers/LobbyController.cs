using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Reversi.Game;
using Reversi.Util;
using ReversiAPI.Lobby;
using ReversiAPI.Model;
using ReversiAPI.Model.ViewModel;
using ReversiAPI.Session;

namespace ReversiAPI.Controllers
{
    [Route("api/lobbies")]
    [ApiController]
    public class LobbyController : ControllerBase
    {
        // GET api/move
        [HttpGet]
        public ActionResult<IEnumerable<GameLobbyInfo>> Get()
        {
            return GameLobbyManager.Active.Select(lobby => new GameLobbyInfo(lobby)).ToList();
        }

        // GET api/move/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            if (!GameLobbyManager.TryGet(id, out GameLobby gameLobby)) return new NotFoundResult();

            return new JsonResult(new GameLobbyInfo(gameLobby));
        }

        [HttpPost]
        public ActionResult Open()
        {
            string sessionId = Request.Headers["session-id"].ToString();

            GameLobby lobby = GameLobbyManager.Open();

            if (!UserSessionManager.SessionExists(sessionId)) return new NotFoundResult();

            if (!UserSessionManager.SetSessionGameLobby(sessionId, lobby)) return new NotFoundResult();

            return new OkObjectResult(lobby.Id);
        }

        [HttpPost("{id}")]
        public ActionResult Join(int id)
        {
            string sessionId = Request.Headers["session-id"].ToString();

            if (!UserSessionManager.SessionExists(sessionId)) return new NotFoundResult();
            if (!GameLobbyManager.TryGet(id, out GameLobby lobby)) return new NotFoundResult();

            UserSession userSession = UserSessionManager.UserSessions[sessionId];

            if (!UserSessionManager.SetSessionGameLobby(userSession, lobby)) return new NotFoundResult();

            return new OkObjectResult(new PlayerInfo(userSession.GameSession.Player));
        }
    }
}