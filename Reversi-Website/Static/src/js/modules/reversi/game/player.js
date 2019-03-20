/**
 * @param {string} username
 * @param {string} colour
 * @constructor
 */
Reversi.Player = function (username, colour) {
    let eventEmitter = new EventModule.EventEmitter();

    const eventNames = {
        selectionChanged: "selection-changed"
    };

    this.username = username;
    this.pieces = [];

    let _colour = colour;

    this.colour = () => _colour;

    this.onSelectionChanged = new EventModule.EventSubscriber(eventNames.selectionChanged, eventEmitter);

    /**
     * Selects piece
     * @param {Reversi.Piece} piece
     */
    this.selectPiece = (piece) => {
        this.deselectPiece();
        this.selectedPiece = piece;
        piece.select();

        eventEmitter.emit(eventNames.selectionChanged);
    };

    /**
     * Deselects piece
     */
    this.deselectPiece = () => {
        if (this.selectedPiece == null) return;

        this.selectedPiece.deselect();

        this.selectedPiece = null;

        eventEmitter.emit(eventNames.selectionChanged);
    };

    /**
     *
     * @param {Reversi.Piece} piece
     */
    this.ownsPiece = (piece) => {
        if (piece == null) return false;

        return this.colour() === piece.colour;
    }
};