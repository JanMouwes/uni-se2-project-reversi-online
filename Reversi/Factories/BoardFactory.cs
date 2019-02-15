using System;
using System.Drawing;
using Reversi.Board;

namespace Reversi.Factories
{
    public class BoardFactory
    {
        public Board.Board CreateBoard(Size size) => CreateBoard(size.Width, size.Height);


        public Board.Board CreateBoard(int x, int y)
        {
            Board.Board board = new Board.Board(x, y);

            CellFactory cellFactory = new CellFactory();

            int cellCount = x * y;
            for (int i = 0; i < cellCount; i++)
            {
                int currentX = i % board.Size.Width;
                int currentY = (int) Math.Floor((decimal) i / board.Size.Height);

                Cell cell = cellFactory.CreateCell(currentX, currentY);
                board.Cells[currentX, currentY] = cell;
            }

            return board;
        }
    }
}