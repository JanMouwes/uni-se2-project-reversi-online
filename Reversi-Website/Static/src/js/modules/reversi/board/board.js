/**
 *
 * @param {Reversi.Size} boardSize
 * @param {Array<Cell>} cells
 * @constructor
 */
Reversi.Board = function (boardSize, cells) {

    /**
     *
     * @type {number}
     */
    this.width = boardSize.x;

    /**
     *
     * @type {number}
     */
    this.height = boardSize.y;

    /**
     *
     * @type {Array<Cell>}
     */
    this.cells = cells;
};