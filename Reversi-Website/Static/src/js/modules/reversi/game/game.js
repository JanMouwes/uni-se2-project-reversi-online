/**
 *
 * @param {Reversi.Board} board
 * @constructor
 */
Reversi.Game = function (board) {


    let eventEmitter = new EventModule.EventEmitter();

    let eventNames = {
        stateUpdated: "state-updated"
    };

    this.stateUpdated = new EventModule.EventSubscriber(eventNames.stateUpdated, eventEmitter);

    /**
     *
     * @returns {Promise<void>}
     */
    this.updateState = () => {

        /**
         *
         * @param {Array<string, Array<Reversi.Coords>>} colourPieces
         */
        let createPieces = colourPieces => {
            let pieces = [];

            //  Calculates 2d array of coordinates keyed by colour to 1d-array of Pieces
            Object.keys(colourPieces).forEach(colour => {
                let factory = new Reversi.PieceFactory(colour);

                let coordsArray = colourPieces[colour];

                pieces.concat(coordsArray.forEach(coords => {
                    let piece = factory.createPiece();
                    piece.position = coords;

                    pieces.push(piece);
                }));
            });

            return pieces;
        };


        return SPA.Data.pieceAPI.getPieceCoordinates()
            .then(createPieces)
            .then(this.setPieces)
            .then(() => eventEmitter.emit(eventNames.stateUpdated));
    };

    let clearBoard = () => {
        while (this.pieces.length > 0) {
            let piece = this.pieces.shift();

            this.despawnPiece(piece);
        }
    };

    /**
     *
     * @param {Array<Reversi.Piece>} pieces
     */
    this.setPieces = (pieces) => {
        clearBoard();

        pieces.forEach(piece => this.spawnPiece(piece, piece.position));
    };

    /**
     *
     * @param {Reversi.Player} player
     */
    this.addPlayer = (player) => {
        if (player.colour in this.players) throw new Error(player.colour + " already exists");

        this.players[player.colour()] = player;

        this.pieces.filter(piece => piece.colour === player.colour()).forEach(item => player.pieces.push(item))
    };

    /**
     *
     * @param {Reversi.Player} player
     */
    this.getPlayerPieces = (player) => {

        /**@param {Reversi.Piece} piece*/
        let pieceFinder = piece => piece.colour === player.colour();
        return this.pieces.filter(pieceFinder);
    };

    /**
     *
     * @param {Reversi.Piece} piece
     * @param {Reversi.Coords} coords
     */
    this.spawnPiece = (piece, coords) => {
        if (piece == null || coords == null)
            throw new Error("Invalid input");

        let targetCell = this.board.cells[coords];
        if (targetCell.occupant != null) throw new Error("Cell already occupied");

        piece.position = coords;
        targetCell.occupant = piece;

        this.pieces.push(piece);
    };

    /**
     *
     * @param {Reversi.Piece} piece
     */
    this.despawnPiece = (piece) => {
        this.board.cells[piece.position].occupant = null;

        if (!this.pieces.includes(piece)) return;

        this.pieces.splice(this.pieces.indexOf(piece), 1);
    };

    /**
     *
     * @type {Array<Reversi.Piece>}
     */
    this.pieces = [];
    /**
     *
     * @type {Reversi.Board}
     */
    this.board = board;

    /**
     *
     * @type {Array<Reversi.Player>}
     */
    this.players = [];

    /**
     *
     * @type {Reversi.BoardSVG}
     */
    this.view = new Reversi.BoardSVG(this);
};