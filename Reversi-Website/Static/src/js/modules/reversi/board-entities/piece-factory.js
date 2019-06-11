/**
 *
 * @param {string} colour
 * @constructor
 */
Reversi.PieceFactory = function (colour) {

    if (colour == null || colour.trim().length === 0) throw new Error("colour cannot be null or empty");

    if (colour.charAt(0) !== "#")
        colour = "#" + colour;

    if (!colour.match(/^#[0-9A-F]{6}$/)) throw new Error("Invalid hex colour code: " + colour);

    this.colour = colour;

    /**
     *
     * @returns {Reversi.Piece}
     */
    this.createPiece = () => {
        return new Reversi.Piece(this.colour);
    };
};