using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Reversi.Game;
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
    }
}