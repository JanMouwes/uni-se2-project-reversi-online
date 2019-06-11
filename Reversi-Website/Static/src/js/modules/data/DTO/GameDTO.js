/**
 *
 * @param {Object} object
 * @constructor
 */
SPA.Data.GameDTO = function (object) {
    /**
     *
     * @type {SPA.Data.BoardDTO}
     */
    this.Board = new SPA.Data.BoardDTO(object.boardInfo);

    /**
     *
     * @type {Array<SPA.Data.PlayerDTO>}
     */
    this.Players = object.players;

    /**
     * @type {Array}
     */
    this.Moves = object.moves == null ? [] : object.moves;

    /**
     * @type {SPA.Data.PlayerDTO}
     */
    this.CurrentPlayer = object.currentPlayer;
};