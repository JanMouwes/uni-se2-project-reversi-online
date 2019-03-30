using System.Collections.Generic;
using Reversi.Game;
using ReversiAPI.Lobby;
using ReversiAPI.Model;

namespace ReversiAPI.Session
{
    public class UserSession
    {
        public UserSession(string id)
        {
            Id = id;
        }

        public string Id { get; }
        
        public GameSession GameSession { get; set; }

        public User User { get; set; }
    }
}