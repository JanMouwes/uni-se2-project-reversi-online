using System.Collections.Generic;
using Reversi.GameEntities;

namespace Reversi.Game
{
    public class Player
    {
        public GameColour Colour { get; set; }

        public List<Piece> Pieces { get; } = new List<Piece>();

        public int Score => Pieces.Count;
    }
}