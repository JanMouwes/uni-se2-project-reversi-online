using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reversi.Game;
using Reversi.GameEntities;
using Reversi.Util;

namespace Reversi_Online.Controllers
{
    [Route("api/reversi")]
    [ApiController]
    public class ReversiController : ControllerBase
    {
        private Game CurrentGame => HttpContext.Session.Get<Game>("currentGame");
        
        
        // GET api/reversi
        [HttpGet]
        public ActionResult<string> Get()
        {
            return "test";
        }

        // GET api/reversi/1,2
        [HttpGet("{coordsString}")]
        public ActionResult<string> Get(string coordsString)
        {
            if (!Regex.IsMatch(coordsString, "^([0-9],[0-9])$"))
                return new BadRequestResult();

            char[] charArray = coordsString.ToCharArray();

            Coords cellCoords = new Coords()
            {
                X = int.Parse(charArray[0].ToString()),
                Y = int.Parse(charArray[2].ToString())
            };

            return cellCoords.ToString();
        }

        // GET api/reversi
        [HttpGet]
        public ActionResult<IEnumerable<Piece>> GetPieces()
        {
            Game currentGame = HttpContext.G
            
            return cellCoords.ToString();
        }

        // GET api/reversi/1,2
        [HttpGet("{coordsString}")]
        public ActionResult<string> GetBoardInfo()
        {
            if (HttpContext.Session.GetString("boardInfo"))
            {
            }

            return cellCoords.ToString();
        }

        // POST api/reversi
        [HttpPost]
        public ActionResult<string> Post([FromBody] Coords value)
        {
            return $"{value.X}, {value.Y}";
        }

        // PUT api/reversi/5
        [HttpPut()]
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