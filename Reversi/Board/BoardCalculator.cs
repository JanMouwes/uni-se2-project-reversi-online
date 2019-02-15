using Reversi.Util;

namespace Reversi.Board
{
    public class BoardCalculator
    {
        private Board board;

        public BoardCalculator(Board board)
        {
            this.board = board;
        }

        public Coords TopLeft => new Coords(0, 0);
        public Coords TopRight => new Coords(board.Size.Width, 0);
        public Coords BottomLeft => new Coords(0, board.Size.Height);
        public Coords BottomRight => new Coords(board.Size.Width, board.Size.Height);

        public Coords GetCentreCoords => new Coords(board.Size.Width / 2, board.Size.Height / 2);
    }
}