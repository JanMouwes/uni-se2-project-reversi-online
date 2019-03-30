using Reversi.Game;
using ReversiAPI.Lobby;

namespace ReversiAPI.Session
{
    public class GameSession
    {
        public GameLobby Lobby { get; set; }
        public Player Player { get; set; }
    }
}