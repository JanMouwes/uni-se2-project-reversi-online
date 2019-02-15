using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Reversi.GameEntities;

namespace Reversi.Board
{
    public class BoardInfo
    {
        private Board board;

        public Size Size => board.Size;

        public IEnumerable<Piece> Pieces => from cell in board.Cells.OfType<Cell>()
            where cell.CurrentPiece != null
            select cell.CurrentPiece;


        public BoardInfo(Board board)
        {
            this.board = board;
        }
    }
}