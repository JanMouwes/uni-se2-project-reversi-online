using System.Text.RegularExpressions;

namespace Reversi.Util
{
    public static class ColourHexUtil
    {
        public static bool IsValid(string hexString) => Regex.IsMatch(hexString, "^[0-9A-F]{6}$", RegexOptions.IgnoreCase);
    }
}