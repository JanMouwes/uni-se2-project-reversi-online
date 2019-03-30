using System.Runtime.Serialization;
using Reversi.Game;

namespace ReversiAPI.Model.ViewModel
{
    public class UserInfo
    {
        public UserInfo(User player)
        {
            UserName = player.Username;
        }

        [DataMember] public int Id;

        [DataMember] public string UserName;
    }
}