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
        public List<Player> Players { get; }
        public Dictionary<Coords, Piece> StartingPieces { get; }

        public Scenario(List<Player> players, IDictionary<Coords, Piece> startingPieces, Size? boardSize = null)
        {
            Dictionary<Coords, Piece> enumerable = new Dictionary<Coords, Piece>(startingPieces);
            if (enumerable.Select(item => item.Value.Colour).Distinct().Count() > players.Count)
                throw new ArgumentException("amount of colours in startingPieces more than playerCount");

            if (boardSize != null) BoardSize = (Size) boardSize;
            Players = players;
            StartingPieces = enumerable;
        }

        public static Scenario DefaultScenario()
        {
            Dictionary<Coords, Piece> pieces = new Dictionary<Coords, Piece>();
            Player blackPlayer = new Player()
            {
                Colour = GameColour.Black
            };
            Player whitePlayer = new Player()
            {
                Colour = GameColour.White
            };
            List<Player> players = new List<Player>
            {
                blackPlayer, whitePlayer
            };

            PieceFactory blackFactory = new PieceFactory(blackPlayer);
            PieceFactory whiteFactory = new PieceFactory(whitePlayer);

            pieces.Add(new Coords(3, 3), whiteFactory.CreatePiece());
            pieces.Add(new Coords(4, 4), whiteFactory.CreatePiece());
            pieces.Add(new Coords(3, 4), blackFactory.CreatePiece());
            pieces.Add(new Coords(4, 3), blackFactory.CreatePiece());

            foreach (KeyValuePair<Coords, Piece> coordsAndPiece in pieces)
            {
                coordsAndPiece.Value.Position = coordsAndPiece.Key;
            }

            return new Scenario(players, pieces);
        }

        public static Scenario DefaultScenario2()
        {
            Dictionary<Coords, Piece> pieces = new Dictionary<Coords, Piece>();
            Player blackPlayer = new Player()
            {
                Colour = GameColour.Black
            };
            Player whitePlayer = new Player()
            {
                Colour = GameColour.White
            };
            Player yellowPlayer = new Player()
            {
                Colour = GameColour.Yellow
            };
            List<Player> players = new List<Player>
            {
                blackPlayer, whitePlayer, yellowPlayer
            };

            PieceFactory blackFactory = new PieceFactory(blackPlayer);
            PieceFactory whiteFactory = new PieceFactory(whitePlayer);
            PieceFactory yellowFactory = new PieceFactory(yellowPlayer);

            pieces.Add(new Coords(3, 3), whiteFactory.CreatePiece());
            pieces.Add(new Coords(4, 4), whiteFactory.CreatePiece());

            pieces.Add(new Coords(3, 4), blackFactory.CreatePiece());
            pieces.Add(new Coords(4, 3), blackFactory.CreatePiece());

            pieces.Add(new Coords(5, 3), yellowFactory.CreatePiece());
            pieces.Add(new Coords(5, 4), yellowFactory.CreatePiece());

            foreach ((Coords key, Piece value) in pieces)
            {
                value.Position = key;
            }

            return new Scenario(players, pieces);
        }
    }
}