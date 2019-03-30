using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Reversi.Board;
using Reversi.Factories;
using Reversi.GameEntities;
using Reversi.Util;

namespace Reversi.Game
{
    public class Scenario
    {
        public static Scenario[] Scenarios =
        {
            DefaultScenario(),
            DefaultScenario2()
        };


        public const int DEFAULT_SIZE = 8;

        public Size BoardSize { get; } = new Size(DEFAULT_SIZE, DEFAULT_SIZE);
        public int PlayerCount => StartingPositions.Select(item => item.Value).Distinct().Count();
        public Dictionary<Coords, string> StartingPositions { get; }

        public Scenario(IDictionary<Coords, string> startingPositions, Size? boardSize = null)
        {
            if (boardSize != null) BoardSize = (Size) boardSize;

            StartingPositions = startingPositions.ToDictionary(item => item.Key, item => item.Value);
        }

        public static Scenario DefaultScenario()
        {
            const string whiteHex = "FFFFFF";
            const string blackHex = "000000";

            IDictionary<Coords, string> startingPositions = new Dictionary<Coords, string>
            {
                {new Coords(3, 3), whiteHex},
                {new Coords(4, 4), whiteHex},
                {new Coords(3, 4), blackHex},
                {new Coords(4, 3), blackHex}
            };

            return new Scenario(startingPositions);
        }

        public static Scenario DefaultScenario2()
        {
            const string whiteHex = "FFFFFF";
            const string blackHex = "000000";

            IDictionary<Coords, string> startingPositions = new Dictionary<Coords, string>
            {
                {new Coords(7, 7), whiteHex},
                {new Coords(8, 8), whiteHex},
                {new Coords(7, 8), blackHex},
                {new Coords(8, 7), blackHex}
            };

            return new Scenario(startingPositions, new Size(16, 16));
        }
    }
}