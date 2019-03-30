/**
 *
 * @param object to be constructed from
 * @constructor
 */
SPA.Data.BoardDTO = function (object) {
    /**
     * @type {Reversi.Size}
     */
    this.Size = Reversi.Size.parse(object.size);

    this.Pieces = object.pieces;
};