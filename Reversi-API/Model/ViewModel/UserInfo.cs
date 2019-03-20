using System.Runtime.Serialization;
using Reversi.Game;

namespace ReversiAPI.Model.ViewModel
{
    public class UserInfo
    {
        public UserInfo(Player player)
        {
            Colour = player.Colour;
            UserName = player.Colour;
        }

        [DataMember] public int Id;

        [DataMember] public string UserName;

        [DataMember] public string Colour;
    }
}