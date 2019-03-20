using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Reversi.Board;
using Reversi.Game;
using Reversi.GameEntities;
using ReversiAPI.Model.ViewModel;
using ReversiAPI.Session;

namespace ReversiAPI.Controllers
{
    [Route("api/pieces")]
    [ApiController]
    public class PieceController : ControllerBase
    {
        // GET api/pieces
        [HttpGet]
        public ActionResult<IEnumerable<PieceInfo>> GetPieces()
        {
            string sessionId = Request.Headers["session-id"].ToString(); //FIXME to constant

            Game currentGame = UserSessionManager.UserSessions[sessionId].Lobby.Game;

            IEnumerable<PieceInfo> pieces = new BoardInfo(currentGame.Board).Pieces;

            return pieces.ToList();
        }
    }
}