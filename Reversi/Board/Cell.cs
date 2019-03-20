using Reversi.GameEntities;
using Reversi.Util;

namespace Reversi.Board
{
    public class Cell
    {
        public Coords Position { get; set; }
        public Piece Occupant { get; set; }
    }
}