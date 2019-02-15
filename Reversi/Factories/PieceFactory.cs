using Reversi.Game;
using Reversi.GameEntities;

namespace Reversi.Factories
{
    public class PieceFactory
    {
        private Player player;

        public PieceFactory(Player player)
        {
            this.player = player;
        }

        public Piece CreatePiece()
        {
            Piece piece = new Piece()
            {
                Colour = player.Colour
            };
            player.Pieces.Add(piece);

            return piece;
        }
    }
}