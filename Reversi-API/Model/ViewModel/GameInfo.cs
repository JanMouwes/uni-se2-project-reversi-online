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
        
        [DataMember] public Scenario Scenario { get; }

        [DataMember] public IEnumerable<UserInfo> Players { get; }

        [DataMember] public UserInfo CurrentPlayer { get; }

        [DataMember] public LinkedList<Move> Moves { get; } //TODO

        public GameInfo(Game game)
        {
            CurrentPlayer = new UserInfo(game.CurrentPlayer);

            Players = new List<UserInfo>(game.Players.Select(item => new UserInfo(item.Value)));

            BoardInfo = new BoardInfo(game.Board);
        }
    }
}