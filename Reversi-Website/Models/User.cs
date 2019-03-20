using System.Security.Cryptography;

namespace Reversi_Website.Models
{
    public class User
    {
        public int Id { get; set; }
        
        public string EmailAddress { get; set; }
        
        public SHA256 PasswordHash { get; set; }
    }
}