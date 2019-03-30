using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.Serialization;
using Reversi.Game;
using Reversi.Util;

namespace ReversiAPI.Model
{
    public class ScenarioDTO
    {
        [DataMember] public Size BoardSize { get; }
        [DataMember] public int PlayerCount { get; }
        [DataMember] public Dictionary<Coords, string> StartingPositions { get; }

        public ScenarioDTO(Scenario scenario)
        {
            this.BoardSize = scenario.BoardSize;
            this.PlayerCount = scenario.PlayerCount;
            this.StartingPositions = new Dictionary<Coords, string>(scenario.StartingPositions);
        }
    }
}