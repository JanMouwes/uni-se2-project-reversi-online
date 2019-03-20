using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Reversi.Game;
using Reversi.Util;
using ReversiAPI.Lobby;
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

            //TODO checks and balances
            UserSessionManager.UserSessions[sessionId].Lobby = lobby;

            return new OkObjectResult(lobby.Id);
        }

        [HttpPost("{id}")]
        public ActionResult Join(int id)
        {
            string sessionId = Request.Headers["session-id"].ToString();

            if (!GameLobbyManager.TryGet(id, out GameLobby lobby)) return new NotFoundResult();

            UserSession userSession = UserSessionManager.UserSessions[sessionId];

            userSession.Player = lobby.Game.Players.First(player => !lobby.Players.ToList().Contains(player.Value)).Value;

            //TODO checks and balances
            userSession.Lobby = lobby;

            return new OkObjectResult(lobby.Id);
        }
    }
}