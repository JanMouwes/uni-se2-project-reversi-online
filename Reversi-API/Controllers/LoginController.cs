using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Reversi.Board;
using ReversiAPI.Model;
using ReversiAPI.Session;

namespace ReversiAPI.Controllers
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        // GET api/reversi
        [HttpGet]
        public ActionResult<BoardInfo> Get()
        {
            string sessionId = Request.Headers["session-id"].ToString();
            if (!UserSessionManager.SessionExists(sessionId)) return new NotFoundResult();

            User currentUser = UserSessionManager.UserSessions[sessionId].User;

            if (currentUser == null) return new NotFoundResult();

            return new JsonResult(currentUser);
        }

        private static bool TryLogin(LoginDTO login, out List<string> errors)
        {
            errors = new List<string>();
            return true; //TODO;
        }

        // POST api/login
        [HttpPost]
        public ActionResult Post([FromForm] LoginDTO login)
        {
            if (!Request.Headers.TryGetValue("session-id", out StringValues sessionId)) return new BadRequestResult();
            if (!TryLogin(login, out List<string> errors))
            {
                return new UnauthorizedResult();
            }

            UserSession session = UserSessionManager.OpenSession(sessionId);

            session.User = new User()
            {
                Username = login.Username
            };

            return new OkObjectResult(sessionId);
        }
    }
}