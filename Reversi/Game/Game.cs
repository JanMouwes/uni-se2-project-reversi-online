using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Collections.Specialized;
using System.Drawing;
using System.Linq;
using Reversi.Board;
using Reversi.Factories;
using Reversi.GameEntities;
using Reversi.Util;

namespace Reversi.Game
{
    public class Game
    {
        public Board.Board Board { get; }

        public PieceSpawner Spawner { get; }

        private Queue<Player> PlayerQueue { get; } = new Queue<Player>();

        public Player CurrentPlayer => PlayerQueue.Peek();

        public Dictionary<GameColour, Player> Players { get; } = new Dictionary<GameColour, Player>();

        public IEnumerable<GameColour> AvailableColours =>
            from colour in Enum.GetValues(typeof(GameColour)).OfType<GameColour>()
            where !Players.ContainsKey(colour)
            select colour;

        /// <summary>
        /// Creates new Game with board
        /// </summary>
        /// <param name="gameScenario">Class containing all needed values to start a game</param>
        public Game(Scenario gameScenario) //TODO change to Scenario
        {
            BoardFactory boardFactory = new BoardFactory();
            Board = boardFactory.CreateBoard(gameScenario.BoardSize);
            Spawner = new PieceSpawner(Board);

            foreach (KeyValuePair<Coords, Piece> piece in gameScenario.StartingPieces)
            {
                Spawner.SpawnPiece(piece.Value, piece.Key);
            }

            foreach (Player scenarioPlayer in gameScenario.Players)
            {
                AddPlayer(scenarioPlayer);
            }
        }


        /// <summary>
        /// Adds player to dictionary and linked list
        /// </summary>
        /// <param name="player">Player to add</param>
        /// <exception cref="ArgumentException">Thrown when Colour already taken</exception>
        public void AddPlayer(Player player)
        {
            if (Players.ContainsKey(player.Colour)) throw new ArgumentException("Player-colour already taken");

            Players[player.Colour] = player;
            PlayerQueue.Enqueue(player);
        }

        /// <summary>
        /// Sets current player to whichever player is next
        /// </summary>
        public void NextPlayer()
        {
            PlayerQueue.Enqueue(PlayerQueue.Dequeue());
        }

        private bool IsMoveLegal(Player player, Move move, ref List<string> errors) //TODO change to List<GameFaults> (enum)
        {
            errors = errors ?? new List<string>();

            Coords from = move.From;
            Coords to = move.To;

            CoordsCalculator coordsCalculator = new CoordsCalculator(from);

            if (!coordsCalculator.IsOnAxisWith(to, out AxisOfEights? _))
            {
                errors.Add("Not on the same axis. Must horizontally, vertically or diagonally align");
                return false;
            }

            if (Board.CellIsOccupied(to))
            {
                errors.Add("Cell is occupied");
                return false;
            }

            IEnumerable<Coords> coordsInBetween = coordsCalculator.GetCoordinatesOnAxisWith(to);

            return Board.CellsFromCoordinates(coordsInBetween).All(cell => cell.CurrentPiece != null && cell.CurrentPiece.Colour != player.Colour);
        }

        public bool TryMakeMove(Player player, Move move, out List<string> errors)
        {
            errors = new List<string>();

            Coords from = move.From;
            Coords to = move.To;

            //List of validation checks, error (failure) messages as keys
            Dictionary<string, bool> checkList = new Dictionary<string, bool>()
            {
                {"Cell 'from' not occupied", !Board.CellIsOccupied(from)},
                {"Cell 'to' occupied", Board.CellIsOccupied(to)},
                {"Cell not owned by player", Board.CellFromCoordinates(from).CurrentPiece.Colour != player.Colour},
            };

            List<string> checkErrors = checkList.Where(item => item.Value).Select(item => item.Key).ToList();

            if (checkErrors.Any() || !IsMoveLegal(player, move, ref errors))
            {
                errors = errors.Concat(checkErrors).ToList();
                return false;
            }

            List<Coords> cellsToTurn = new List<Coords>();

            CoordsCalculator calculator = new CoordsCalculator(to);

            foreach (Piece playerPiece in player.Pieces)
            {
                if (!calculator.IsOnAxisWith(playerPiece.Position, out AxisOfEights? _)) continue;

                List<Coords> addCoords = calculator.GetCoordinatesOnAxisWith(from).ToList();

                if (!addCoords.Any()) continue;

                cellsToTurn.AddRange(addCoords);
            }

            foreach (Cell cell in Board.CellsFromCoordinates(cellsToTurn))
            {
                cell.CurrentPiece.Colour = player.Colour;
            }

            PieceFactory pieceFactory = new PieceFactory(player);

            Spawner.SpawnPiece(pieceFactory.CreatePiece(), to);

            return true;
        }
    }
}