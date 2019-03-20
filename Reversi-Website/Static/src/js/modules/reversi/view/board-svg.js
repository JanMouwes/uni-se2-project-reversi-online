/**
 *
 * @param {Reversi.Game} game
 * @constructor
 */
Reversi.BoardSVG = function (game) {
    let eventEmitter = new EventModule.EventEmitter();

    let eventNames = {
        update: "update"
    };

    let elementFactory = new Reversi.BoardElementFactory();

    /**
     *
     * @type {SVGElement}
     */
    this.element = elementFactory.createBoardElement(game.board.width, game.board.height, game.board.cells);

    /**
     *
     * @type {Array<SVGCircleElement>}
     */
    this.pieces = [];

    /**
     *
     * @type {Array<SVGRectElement>}
     */
    this.cells = [];

    /**
     *
     * @type {Reversi.Game}
     */
    this.model = game;

    /**
     *
     * @param {Reversi.Piece} piece
     */
    this.renderPiece = (piece) => {
        let coords = piece.position;

        let pieceElement = elementFactory.createPieceElement(piece);

        this.pieces[coords] = pieceElement;

        this.element.appendChild(pieceElement);
    };

    /**
     *
     * @param {Reversi.Cell} cell
     */
    let renderCell = (cell) => {
        let element = elementFactory.createCellElement(cell);

        this.cells[cell.coords] = element;

        this.element.appendChild(element);
    };

    /**
     *
     */
    this.clear = () => {

        let removeByKey = key => this.element.removeChild(this.pieces[key]);

        Object.keys(this.pieces).forEach(removeByKey);

        this.pieces = [];
    };

    /**
     *
     */
    this.render = () => {
        let cells = [];

        let addByCoords = coords => cells.push(this.model.board.cells[coords]);

        Object.keys(this.model.board.cells).forEach(addByCoords);
        cells.forEach(renderCell);

        this.update();
    };

    /**
     *
     * @type {{subscribe: (function(*=): void), unsubscribe: (function(*=): void)}}
     */
    this.updateInvoked = {
        subscribe: callback => eventEmitter.subscribe(eventNames.update, callback),
        unsubscribe: callback => eventEmitter.unsubscribe(eventNames.update, callback)
    };

    /**
     *
     */
    this.update = () => {
        this.clear();
        this.model.pieces.forEach(this.renderPiece);

        eventEmitter.emit(eventNames.update);
    }
};