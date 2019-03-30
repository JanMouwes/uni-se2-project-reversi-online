using System.Runtime.Serialization;
using Reversi.Game;

namespace ReversiAPI.Model.ViewModel
{
    public class PlayerInfo
    {
        [DataMember] public string Colour;
        [DataMember] public int Score;

        public PlayerInfo(Player player)
        {
            Colour = player.Colour;
            Score = player.Score;
        }
    }
}