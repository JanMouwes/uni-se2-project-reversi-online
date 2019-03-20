/**
 *
 * @param {Coords} coords
 * @param {string} colour
 * @param {Reversi.Piece} occupant
 * @constructor
 */
Reversi.Cell = function (coords, colour, occupant = null) {
    this.coords = coords;
    this.colour = colour;
    this.occupant = occupant;
    this.onClick = null;
    this.onRightClick = null;
};