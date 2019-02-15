using Reversi.Util;

namespace Reversi.Game
{
    public struct Move
    {
        public Coords From { get; set; }
        public Coords To { get; set; }


        public Move(Coords from, Coords to)
        {
            this.From = from;
            this.To = to;
        }
    }
}