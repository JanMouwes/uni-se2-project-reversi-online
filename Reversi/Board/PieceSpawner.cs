using System;
using Reversi.GameEntities;
using Reversi.Util;

namespace Reversi.Board
{
    public class PieceSpawner
    {
        private Board board;

        public PieceSpawner(Board board)
        {
            this.board = board;
        }

        public void SpawnPiece(Piece piece, Coords targetCoords)
        {
            if (board.CellIsOccupied(targetCoords)) throw new ArgumentException();

            piece.Position = targetCoords;

            board.AddPiece(piece, targetCoords);
        }
    }
}