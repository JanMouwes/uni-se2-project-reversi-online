using System;
using System.Collections.Generic;
using System.Globalization;
using Reversi.GameEntities;
using Reversi.Util;

namespace Reversi.Game
{
    public class Player
    {
        private string colour;

        public string Colour
        {
            get => colour;
            set
            {
                if (!ColourHexUtil.IsValid(value)) throw new ArgumentException($"Invalid input: {value}");

                colour = value;
            }
        }

        public List<Piece> Pieces { get; } = new List<Piece>();

        public int Score => Pieces.Count;
    }
}