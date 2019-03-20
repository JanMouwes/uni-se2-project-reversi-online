using System.Runtime.Serialization;
using Reversi.GameEntities;
using Reversi.Util;

namespace ReversiAPI.Model.ViewModel
{
    public class PieceInfo
    {
        public PieceInfo(Piece piece)
        {
            Colour = piece.Owner.Colour;
            Position = piece.Position;
        }

        [DataMember] public string Colour { get; }
        [DataMember] public Coords Position { get; }
    }
}