using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Reversi.Game;
using Reversi.GameEntities;
using SessionExtensions;

namespace ReversiAPI.Controllers
{
    [Route("api/pieces")]
    [ApiController]
    public class PieceController : ControllerBase
    {
        private Game CurrentGame => HttpContext.Session.Get<Game>("currentGame");

        // GET api/pieces
        [HttpGet]
        public ActionResult<IEnumerable<Piece>> GetPieces()
        {
            IEnumerable<Piece> pieces = CurrentGame.Board.BoardInfo.Pieces;

            return pieces.ToList();
        }
    }
}