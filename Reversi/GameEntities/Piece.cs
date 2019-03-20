using Reversi.Game;
using Reversi.Util;

namespace Reversi.GameEntities
{
    public class Piece
    {
        public Player Owner { get; set; }
        public Coords Position { get; set; }
    }
}