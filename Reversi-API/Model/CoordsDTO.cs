using Reversi.Util;

namespace ReversiAPI.Model
{
    public class CoordsDTO
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Coords ToCoords => new Coords()
        {
            X = X,
            Y = Y
        };
    }
}