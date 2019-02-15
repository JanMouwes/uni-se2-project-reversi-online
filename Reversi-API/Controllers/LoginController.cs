using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Reversi.Board;
using Reversi.Game;
using Reversi.Util;
using ReversiAPI.Model;
using ReversiAPI.Util;
using SessionExtensions;

namespace ReversiAPI.Controllers
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        public User currentUser;

        public bool IsLoggedIn => currentUser != null;

        // GET api/reversi
        [HttpGet]
        public ActionResult<BoardInfo> Get()
        {
            if (!IsLoggedIn) return new NotFoundResult();

            return new JsonResult(currentUser);
        }

        private bool TryLogin(LoginDTO login, out List<string> errors)
        {
            errors = new List<string>();
            return true; //TODO;
        }

        // POST api/reversi
        [HttpPost]
        public ActionResult Post([FromForm] LoginDTO login)
        {
            if (!TryLogin(login, out List<string> errors))
            {
                return new UnauthorizedResult();
            }

            return new OkResult();
        }
    }
}