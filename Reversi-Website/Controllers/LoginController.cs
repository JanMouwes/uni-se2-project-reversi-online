using Microsoft.AspNetCore.Mvc;

namespace Reversi_Website.Controllers
{
    public class LoginController : Controller
    {
        // GET
        public IActionResult Index()
        {
            return Login();
        }
        
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult RegisterPost()
        {
            return new OkResult();
        }
    }
}