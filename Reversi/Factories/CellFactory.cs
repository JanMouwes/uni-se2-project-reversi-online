using System;
using Reversi.Board;
using Reversi.Util;

namespace Reversi.Factories
{
    public class CellFactory
    {
        public Cell CreateCell(int x, int y)
        {
            return new Cell()
            {
                Position = new Coords(x, y)
            };
        }
    }
}