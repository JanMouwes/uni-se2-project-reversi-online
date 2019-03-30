using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;
using Reversi.Board;
using Reversi.Game;
using Reversi.GameEntities;

namespace ReversiAPI.Model.ViewModel
{
    public class GameInfo
    {
        [DataMember] public BoardInfo BoardInfo { get; }

        [DataMember] public IEnumerable<PlayerInfo> Players { get; }

        [DataMember] public PlayerInfo CurrentPlayer { get; }

        [DataMember] public LinkedList<Move> Moves { get; } //TODO

        public GameInfo(Game game)
        {
            CurrentPlayer = new PlayerInfo(game.CurrentPlayer);

            Players = new List<PlayerInfo>(game.Players.Values.Select(player => new PlayerInfo(player)));

            BoardInfo = new BoardInfo(game.Board);
        }
    }
}