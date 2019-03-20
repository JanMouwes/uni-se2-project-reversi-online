namespace Reversi_Website.Util.PasswordStrengthVerifiers
{
    public interface IPasswordStrengthVerifier
    {
        bool IsSufficient(string password);
    }
}