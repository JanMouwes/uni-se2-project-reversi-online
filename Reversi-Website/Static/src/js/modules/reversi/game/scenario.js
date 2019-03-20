/**
 * @param {Size} boardSize
 * @constructor
 */
Reversi.Scenario = function(boardSize) {

    /**
     *
     * @param {string} colour
     * @param {Coords} coords
     */
    this.addPiece = (colour, coords) => {
        if (this.startingPiecesCoords[colour] == null) this.startingPiecesCoords[colour] = [];

        this.startingPiecesCoords[colour].push(coords);
    };

    /**
     *
     * @param {Player} player
     * @param {string} colour
     */
    this.addPlayer = (player, colour) => {
        this.players[colour] = player;
    };

    /**
     *
     * @type {Size}
     */
    this.boardSize = boardSize;

    /**
     *
     * @type {Array<Array<Coords>>}
     */
    this.startingPiecesCoords = [];

    /**
     *
     * @type {Array<Player>}
     */
    this.players = [];
};