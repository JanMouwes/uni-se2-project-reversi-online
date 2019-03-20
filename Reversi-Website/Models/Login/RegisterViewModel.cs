using System.ComponentModel.DataAnnotations;

namespace Reversi_Website.Models.Login
{
    public class RegisterViewModel
    {
        [Display(Name = "Email address")]
        [DataType(DataType.EmailAddress)]
        [Required(ErrorMessage = "Please enter your name", AllowEmptyStrings = false)]
        public string Email { get; set; }

        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Please enter a password", AllowEmptyStrings = false)]
        public string Password { get; set; }

        [Display(Name = "Password confirmation")]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Please enter both passwords", AllowEmptyStrings = false)]
        public string PasswordConfirmation { get; set; }
    }
}