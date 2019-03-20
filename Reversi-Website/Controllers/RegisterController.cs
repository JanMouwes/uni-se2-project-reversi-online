using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Reversi_Website.Data;
using Reversi_Website.Models;
using Reversi_Website.Models.Login;
using Reversi_Website.Util.PasswordStrengthVerifiers;

namespace Reversi_Website.Controllers
{
    public class RegisterController : Controller
    {
        // GET
        public IActionResult Index()
        {
            return View("Register");
        }

        // GET
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult OnPost(RegisterViewModel registration)
        {
            ViewData["success"] = false;

            // Checklist of failure conditions, their error messages as keys
            Dictionary<string, bool> checkList = new Dictionary<string, bool>
            {
                {"Passwords don't match", registration.Password != registration.PasswordConfirmation},
                {"Password not strong enough", !new Weak_PasswordStrengthVerifier().IsSufficient(registration.Password)},
            };

            if (checkList.Any(item => item.Value))
            {
                IEnumerable<string> passwordErrors = checkList
                    .Where(item => item.Value)
                    .Select(item => item.Key);
                ViewData.Add("errors", passwordErrors.ToList());

                return View("Register");
            }

            SHA256 hash = SHA256.Create(registration.Password);

            User newUser = new User
            {
                EmailAddress = registration.Email,
                PasswordHash = hash
            };

            UserAccessLayer accessLayer = new UserAccessLayer();

            if (!accessLayer.Add(newUser, out IEnumerable<string> addErrors))
            {
                ViewData.Add("errors", addErrors);

                return View("Register");
            }

            ViewData["success"] = true;
            return new RedirectResult("/register");
        }
    }
}