namespace Reversi.Util
{
    public struct Coords
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Coords(int x, int y)
        {
            X = x;
            Y = y;
        }

        public override string ToString()
        {
            return $"({X}, {Y})";
        }

        public static Coords operator +(Coords first, Coords second) => new Coords()
        {
            X = first.X + second.X,
            Y = first.Y + second.Y
        };

        public static Coords operator -(Coords first, Coords second) => new Coords()
        {
            X = first.X - second.X,
            Y = first.Y - second.Y
        };

        public static bool operator ==(Coords first, Coords second) => first.X == second.X &&
                                                                       first.Y == second.Y;

        public static bool operator !=(Coords first, Coords second) => !(first == second);
    }
}