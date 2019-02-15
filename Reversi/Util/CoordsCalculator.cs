using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;

namespace Reversi.Util
{
    /// <summary>
    /// 90- and 45-degree angles
    /// </summary>
    public enum AxisOfEights
    {
        X,
        Y,
        SlopeUpwards,
        SlopeDownwards
    }

    public class CoordsCalculator
    {
        private Coords coords;

        public CoordsCalculator(Coords coords)
        {
            this.coords = coords;
        }

        /// <summary>
        /// Determines whether the coordinates and the target share an axis, returns this axis if so.
        /// </summary>
        /// <param name="target">The other coordinate</param>
        /// <param name="commonAxis">The shared axis</param>
        /// <returns>Whether the coordinates share an axis with the target</returns> //TODO clean up this garbage
        public bool IsOnAxisWith(Coords target, out AxisOfEights? commonAxis)
        {
            bool hasCommonHorizontalAxis = coords.X == target.X || coords.Y == target.Y;

            commonAxis = null;
            if (hasCommonHorizontalAxis)
            {
                commonAxis = coords.X == target.X ? AxisOfEights.X : AxisOfEights.Y;
            }

            if (hasCommonHorizontalAxis) return true;

            Coords derivedCoords = coords - target;

            commonAxis = derivedCoords.X == derivedCoords.Y ? AxisOfEights.SlopeUpwards : AxisOfEights.SlopeDownwards;

            derivedCoords = new Coords(
                Math.Abs(derivedCoords.X),
                Math.Abs(derivedCoords.Y)
            );

            return derivedCoords.X == derivedCoords.Y;
        }

        /// <summary>
        /// Gets coordinates on axis with other coordinate
        /// </summary>
        /// <param name="target">Coords on axis with </param>
        /// <param name="includeOriginAndTarget"></param>
        /// <returns>List of coordinates on axis with two coordinates</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="ArgumentOutOfRangeException"></exception> //TODO clean up this garbage
        public IEnumerable<Coords> GetCoordinatesOnAxisWith(Coords target, bool includeOriginAndTarget = false)
        {
            if (!IsOnAxisWith(target, out AxisOfEights? _)) throw new ArgumentException("Target is not on axis with coordinates");

            int DirectionInt(int first, int second) => first == second ? 0 : first > second ? -1 : 1;

            Coords deltaCoords = new Coords
            {
                X = DirectionInt(coords.X, target.X),
                Y = DirectionInt(coords.Y, target.Y),
            };

            List<Coords> coordinateList = new List<Coords>();

            Coords currentCoords = coords + deltaCoords;

            while (currentCoords != target)
            {
                coordinateList.Add(currentCoords);
                currentCoords = currentCoords + deltaCoords;
            }

            if (!includeOriginAndTarget) return coordinateList;

            List<Coords> coordinatesWithOriginAndTarget = new List<Coords>();
            coordinatesWithOriginAndTarget.Add(coords);
            coordinatesWithOriginAndTarget.AddRange(coordinateList);
            coordinatesWithOriginAndTarget.Add(target);

            return coordinatesWithOriginAndTarget;
        }
    }
}