using System;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Reversi.Board;
using Reversi.Util;
using ReversiAPI.Util;

namespace ReversiAPI.Controllers
{
    [Route("api/board")]
    [ApiController]
    public class BoardController : ControllerBase
    {
        // GET api/reversi
        [HttpGet]
        public ActionResult<BoardInfo> Get()
        {
            if (!Request.Headers.TryGetValue("session-id", out StringValues values)) return new BadRequestResult();

            if (!GameSessionHelper.SessionExists(values.ToString())) return new NotFoundResult();

            GameSessionHelper sessionHelper = new GameSessionHelper(values.ToString());

            return new JsonResult(new BoardInfo(sessionHelper.CurrentGame.Board));
        }

        // GET api/reversi/1,2
        [HttpGet("{coordsString}")]
        public ActionResult Get(string coordsString)
        {
            if (!Request.Headers.TryGetValue("session-id", out StringValues values)) return new BadRequestResult();

            GameSessionHelper sessionHelper;
            try
            {
                sessionHelper = new GameSessionHelper(values.ToString());
            }
            catch (ArgumentException)
            {
                return new NotFoundResult();
            }

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