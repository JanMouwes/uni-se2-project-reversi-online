using Reversi.Board;
using Reversi.Util;

namespace Reversi.GameEntities
{
    public class Piece
    {
        public GameColour Colour { get; set; } //TODO change to Player (owner)
        public Coords Position { get; set; }
    }
}