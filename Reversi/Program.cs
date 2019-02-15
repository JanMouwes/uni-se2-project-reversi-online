using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Reversi.Game;
using Reversi.Util;

namespace Reversi
{
    class Program
    {
        static void Main(string[] args)
        {
            Scenario scenario = Scenario.DefaultScenario();

            Game.Game game = new Game.Game(scenario);

            List<string> errors = new List<string>();

            do
            {
                Console.Clear();
                Console.WriteLine(game.Board);
                Console.WriteLine($"It's {game.CurrentPlayer.Colour}'s turn");
                errors.ForEach(Console.WriteLine);

                string input = Console.ReadLine();

                if (input == null || input == "quit") break;

                if (!Regex.IsMatch(input, "^([0-9],[0-9]) ([0-9],[0-9])$"))
                {
                    errors.Add("Invalid input");
                    continue;
                }

                string[] inputSplit = input.Trim().Split(" ");
                string[] firstCoordsSplit = inputSplit[0].Split(",");
                string[] secondCoordsSplit = inputSplit[1].Split(",");

                Coords firstCoords = new Coords(Convert.ToInt32(firstCoordsSplit[0]), Convert.ToInt32(firstCoordsSplit[1]));
                Coords secondCoords = new Coords(Convert.ToInt32(secondCoordsSplit[0]), Convert.ToInt32(secondCoordsSplit[1]));

                Move move = new Move(firstCoords, secondCoords);

                if (game.TryMakeMove(game.CurrentPlayer, move, out errors))
                    game.NextPlayer();
            } while (game.Board.UnoccupiedCoords.Any());
        }
    }
}