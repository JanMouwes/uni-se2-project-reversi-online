/**
 *
 * @param {string} colour
 * @constructor
 */
Reversi.PieceFactory = function (colour) {

    if (colour == null) throw new Error("colour cannot be null");

    colour = colour.replace("#", "");
    if (!colour.match(/^[0-9A-F]{6}$/)) throw new Error("Invalid hex colour code");

    this.colour = "#".concat(colour);

    /**
     *
     * @returns {Reversi.Piece}
     */
    this.createPiece = () => {
        return new Reversi.Piece(this.colour);
    };
};