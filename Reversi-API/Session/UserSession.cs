using System.Collections.Generic;
using Reversi.Game;
using ReversiAPI.Lobby;

namespace ReversiAPI.Session
{
    public class UserSession
    {
        public UserSession(string id)
        {
            Id = id;
        }

        public string Id { get; }
        
        public GameLobby Lobby { get; set; }

        public Player Player { get; set; }
    }
}