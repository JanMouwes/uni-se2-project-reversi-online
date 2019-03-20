using Reversi.Game;
using Reversi.Util;

namespace ReversiAPI.Model
{
    public class MoveDTO
    {
        public int FromX { get; set; }
        public int FromY { get; set; }

        public int ToX { get; set; }
        public int ToY { get; set; }

        public Move ToMove => new Move
        {
            From = new Coords
            {
                X = FromX,
                Y = FromY
            },
            To = new Coords
            {
                X = ToX,
                Y = ToY
            }
        };
    }
}