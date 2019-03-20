using System.Collections.Generic;
using System.Linq;
using Reversi.Game;

namespace ReversiAPI.Lobby
{
    public class GameLobby
    {
        public int Id;

        public Game Game { get; set; }

        private Dictionary<string, Player> players = new Dictionary<string, Player>();

        public IEnumerable<Player> Players => players.Select(item => item.Value);

        public IEnumerable<string> Colours => players.Select(item => item.Key);

        //TODO spectators
    }
}