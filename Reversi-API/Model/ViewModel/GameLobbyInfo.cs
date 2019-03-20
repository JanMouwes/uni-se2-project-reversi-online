using System.Collections.Generic;
using System.Linq;
using Reversi.Game;
using ReversiAPI.Lobby;

namespace ReversiAPI.Model.ViewModel
{
    public class GameLobbyInfo
    {
        public GameLobbyInfo(GameLobby lobby)
        {
            Id = lobby.Id;
            players = lobby.Players.Select(player => new UserInfo(player));

            if (lobby.Game == null) return;
            
            Game = new GameInfo(lobby.Game);
        }

        public int Id;

        public GameInfo Game { get; set; }

        private IEnumerable<UserInfo> players;

        //TODO spectators
    }
}