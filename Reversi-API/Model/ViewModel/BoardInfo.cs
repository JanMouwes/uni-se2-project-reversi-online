using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;
using Reversi.GameEntities;
using ReversiAPI.Model.ViewModel;

namespace Reversi.Board
{
    public class BoardInfo
    {
        private Board board;

        [DataMember] public Size Size => board.Size;

        [DataMember]
        public IEnumerable<PieceInfo> Pieces => from cell in board.Cells.OfType<Cell>()
            where cell.Occupant != null
            select new PieceInfo(cell.Occupant);

        public BoardInfo(Board board)
        {
            this.board = board;
        }
    }
}