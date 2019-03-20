using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using Reversi.GameEntities;
using Reversi.Util;

namespace Reversi.Board
{
    public class Board
    {
        private const string COORDS_OUT_OF_RANGE_MESSAGE = "Coordinates are out of range";
        private const string CELL_OCCUPIED_MESSAGE = "Cell already occupied";

        public Cell[,] Cells { get; }
        public Size Size => new Size(Cells.GetLength(0), Cells.GetLength(1));

        public Board(int width, int height)
        {
            if (width < 0 || height < 0) throw new IndexOutOfRangeException();

            Cells = new Cell[width, height];
        }

        public IEnumerable<Cell> UnoccupiedCoords => from cell in Cells.OfType<Cell>()
            where cell.Occupant != null
            select cell;

        public bool CellExists(Coords coords) => Cells.OfType<Cell>().Any(cell => coords == cell.Position);

        public Cell CellFromCoordinates(Coords coords) => Cells[coords.X, coords.Y];

        public IEnumerable<Cell> CellsFromCoordinates(IEnumerable<Coords> coordinatesList) =>
            from cell in Cells.OfType<Cell>()
            where coordinatesList.Contains(cell.Position)
            select cell;

        public bool AreCoordsInRange(Coords coords) => AreCoordsInRange(coords.X, coords.Y);
        public bool AreCoordsInRange(int x, int y) => (x < Size.Width && y < Size.Height) && (x >= 0 && y >= 0);

        public bool CellIsOccupied(Cell cell)
        {
            return CellIsOccupied(cell.Position);
        }

        public bool CellIsOccupied(Coords coords) => CellIsOccupied(coords.X, coords.Y);

        public bool CellIsOccupied(int x, int y)
        {
            if (!AreCoordsInRange(x, y))
                throw new ArgumentOutOfRangeException(COORDS_OUT_OF_RANGE_MESSAGE);

            return Cells[x, y].Occupant != null;
        }

        /// <inheritdoc cref="AddPiece(Reversi.GameEntities.Piece,int,int)"/>
        /// <param name="piece">Piece to be added</param>
        /// <param name="coords">X- and Y-coordinates</param>
        public void AddPiece(Piece piece, Coords coords) => AddPiece(piece, coords.X, coords.Y);

        /// <summary>
        /// Places piece on the board. Checks for range and occupation.
        /// </summary>
        /// <param name="piece">Piece to be placed</param>
        /// <param name="x">X-coordinate</param>
        /// <param name="y">Y-coordinate</param>
        /// <exception cref="ArgumentOutOfRangeException">Thrown when Coords not in range</exception>
        /// <exception cref="ArgumentException">Thrown when cell already occupied</exception> //TODO CellOccupiedException
        public void AddPiece(Piece piece, int x, int y)
        {
            if (!AreCoordsInRange(x, y)) throw new ArgumentOutOfRangeException(COORDS_OUT_OF_RANGE_MESSAGE);

            if (CellIsOccupied(x, y)) throw new ArgumentException(CELL_OCCUPIED_MESSAGE);

            Cells[x, y].Occupant = piece;
        }

        public override string ToString()
        {
            StringBuilder stringBuilder = new StringBuilder();

            stringBuilder.Append("  ");
            for (int yIndex = 0; yIndex < Size.Width; yIndex++)
            {
                stringBuilder.Append(yIndex);
                stringBuilder.Append(" ");
            }

            stringBuilder.Append("\n\r");

            for (int xIndex = 0; xIndex < Size.Height; xIndex++)
            {
                stringBuilder.Append(xIndex);

                for (int yIndex = 0; yIndex < Size.Width; yIndex++)
                {
                    char addChar = Cells[xIndex, yIndex].Occupant?.Owner.Colour.ToString().ToCharArray()[0] ?? '_';

                    stringBuilder.Append(" ");
                    stringBuilder.Append(addChar);
                }

                stringBuilder.Append("\n\r");
            }

            return stringBuilder.ToString();
        }
    }
}