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
                Owner = player
            };
            player.Pieces.Add(piece);

            return piece;
        }
    }
}