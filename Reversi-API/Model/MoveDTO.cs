using Newtonsoft.Json;
using Reversi.Game;
using Reversi.Util;

namespace ReversiAPI.Model
{
    public class MoveDTO
    {
        [JsonProperty("from")] public Coords From { get; set; }

        [JsonProperty("to")] public Coords To { get; set; }
        
        public Move ToMove => new Move()
        {
            From = From,
            To = To,
        };
    }
}