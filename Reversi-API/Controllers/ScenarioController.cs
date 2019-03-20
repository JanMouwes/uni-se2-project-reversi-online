using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Reversi.Game;
using Reversi.Util;

namespace ReversiAPI.Controllers
{
    [Route("api/scenario")]
    [ApiController]
    public class ScenarioController : ControllerBase
    {
        // GET api/move
        [HttpGet]
        public ActionResult<IEnumerable<Scenario>> Get()
        {
            return new JsonResult(Scenario.Scenarios);
        }

        // GET api/move/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            if (Scenario.Scenarios.Length <= id) return new NotFoundResult();

            return new JsonResult(Scenario.Scenarios[id]);
        }
    }
}