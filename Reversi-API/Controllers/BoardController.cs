using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Reversi.Board;
using Reversi.Game;
using Reversi.Util;
using ReversiAPI.Util;
using SessionExtensions;

namespace ReversiAPI.Controllers
{
    [Route("api/board")]
    [ApiController]
    public class BoardController : ControllerBase
    {
        private readonly GameSessionHelper sessionHelper;

        public BoardController()
        {
            sessionHelper = new GameSessionHelper(this);
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

            return new JsonResult(sessionHelper.CurrentGame.Board.CellFromCoordinates(cellCoords));
        }

        // PUT api/reversi/5
        [HttpPut]
        public void Put([FromBody] string value)
        {
        }

        // DELETE api/reversi/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}