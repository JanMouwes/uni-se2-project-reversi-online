using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using Reversi.Game;
using ReversiAPI.Lobby;

namespace ReversiAPI.Model.ViewModel
{
    public class GameLobbyInfo
    {
        public GameLobbyInfo(GameLobby lobby)
        {
            Id = lobby.Id;
            Users = lobby.Users.Select(player => new UserInfo(player));

            if (lobby.Game == null) return;

            Game = new GameInfo(lobby.Game);
        }

        [DataMember] public int Id;

        [DataMember] public GameInfo Game { get; set; }

        [DataMember] public IEnumerable<UserInfo> Users { get; set; }

        //TODO spectators
    }
}