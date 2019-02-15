const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

let Util = (() => {
    /**
     *
     * @param {Element} target
     * @param {Array | Object} attributes
     * @private
     */
    let setAttributesNS = (target, attributes) => {
        if (!(target instanceof Element)) throw new Error("target not an HTMLElement");
        if (attributes instanceof Object) attributes = objectToArray(attributes);
        if (!(attributes instanceof Array)) throw new Error("target not an Array");

        for (let key in attributes) {
            target.setAttribute(key, attributes[key]);
        }
    };

    /**
     *
     * @param object
     * @returns {Array}
     * @private
     */
    let objectToArray = (object) => {
        if (!(object instanceof Object)) throw new Error("target not an Object");

        let output_array = [];
        Object.keys(object).map((key) => {
            output_array[key] = object[key];
        });

        return output_array;
    };

    return {
        objectToArray: objectToArray,
        setAttributesNS: setAttributesNS
    }
})();

/**
 *
 * @param {Coords} coords
 * @param {string} colour
 * @param {Piece} occupant
 * @param {SVGRectElement} element
 * @constructor
 */
function Cell(coords, colour, occupant = null, element) {
    this.coords = coords;
    this.colour = colour;
    this.occupant = occupant;
    this.element = element;
    this.onClick = null;
    this.onRightClick = null;
}

/**
 *
 * @param {number} cellSize
 * @param {function} onClick
 * @constructor
 */
function CellFactory(cellSize, onClick) {

    /**
     *
     * @param {Coords} realCoords
     * @param {string} colour
     * @returns {SVGRectElement}
     * @private
     */
    let _createCellElement = (realCoords, colour) => {
        if (!realCoords instanceof Coords) throw new Error("Coords aren't coords"); //NICER this is lazy

        let cellElement = document.createElementNS(SVG_NAMESPACE, "rect");
        let cell_attributes = {
            x: realCoords.x,
            y: realCoords.y,
            width: this.cellSize,
            height: this.cellSize,
            style: "fill:" + colour
        };

        Util.setAttributesNS(cellElement, cell_attributes);

        return cellElement;
    };

    /**
     *
     * @param {Coords} coords
     * @param onClick
     * @returns {Cell}
     */
    let _createCell = (coords, onClick = null) => {
        if (!coords instanceof Coords) throw new Error("coords not instance of coords");

        onClick = (onClick != null) ? onClick : () => {
            console.log(coords.toString())
        };

        let realCoords = CoordsFactory.createCoords(coords.x * this.cellSize, coords.y * this.cellSize);

        let colour = (coords.x + coords.y) % 2 === 1 ? "red" : "black"; //TODO make cell colours dynamic

        let element = _createCellElement(realCoords, colour);

        let cell = new Cell(coords, colour, null, element);

        element.addEventListener("click", cell.onClick || onClick);
        element.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            if (cell.onRightClick != null) {
                cell.onRightClick();
                return;
            }
            onClick();
        });

        return cell;

    };

    this.cellSize = cellSize;
    this.createCell = (coords) => _createCell(coords, onClick);
}

/**
 *
 * @param {number} cellSize
 * @param {number} width
 * @param {number} height
 * @param {Array<Cell>} cells
 * @param {HTMLElement} element
 * @constructor
 */
function Board(cellSize, width, height, cells, element) {

    /**
     *
     * @param {number} width
     * @param {number} height
     * @private
     */
    let _setDimensions = (width, height) => {
        this.element.setAttribute("width", width + "px");
        this.element.setAttribute("height", height + "px");
    };

    /**
     *
     * @param {Piece} piece
     * @param {Coords} coords
     * @private
     */
    let _spawnPiece = (piece, coords) => {
        let targetCell = this.cells[coords];
        if (targetCell.occupant != null) throw new Error("Cell already occupied");

        piece.position = coords;
        targetCell.occupant = piece;

        let adjustedCoords = CoordsFactory.createCoords(coords.x + 0.5, coords.y + 0.5);

        let cell_attributes = { //TODO find a way to 'recalculate' these coordinates. Probably through a coords/cellCalculator of sorts.
            cx: adjustedCoords.x * cellSize,
            cy: adjustedCoords.y * cellSize
        };

        Util.setAttributesNS(piece.element, cell_attributes);
        this.element.appendChild(piece.element);
    };

    this.setDimensions = _setDimensions;
    this.spawnPiece = _spawnPiece;

    this.width = width;
    this.height = height;
    this.cells = cells;
    this.element = element;
}

/**
 *
 * @param {number} cellSize
 * @param {CellFactory} cellFactory
 * @constructor
 */
function BoardFactory(cellSize, cellFactory) {

    /**
     *
     * @param {number} width
     * @param {number} height
     * @param {Array} cells
     * @returns {SVGElement}
     * @private
     */
    let _createBoardElement = (width, height, cells) => {
        let boardElement = document.createElementNS(SVG_NAMESPACE, "svg");

        //TODO type checking

        Object.keys(cells).map((item) => {
            boardElement.appendChild(cells[item].element);
        });

        let realWidth = width * this.cellSize;
        let realHeight = height * this.cellSize;

        Util.setAttributesNS(boardElement, {
            viewBox: "0 0 " + realWidth + " " + realHeight
        });

        return boardElement;
    };

    /**
     *
     * @param {number} width: the width in cells
     * @param {number} height: the height in cells
     * @returns {Board}
     * @private
     */
    let _createBoard = (width, height) => {
        let rows = [];
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            let cells = [];
            for (let columnIndex = 0; columnIndex < width; columnIndex++) {
                let coords = CoordsFactory.createCoords(columnIndex, rowIndex);

                cells[columnIndex] = this.cellFactory.createCell(coords);
            }
            rows[rowIndex] = cells;
        }

        let cells = [];
        rows.forEach(row => row.forEach(cell => cells[cell.coords.toString()] = cell));

        let boardElement = _createBoardElement(width, height, cells);

        return new Board(cellSize, width, height, cells, boardElement);
    };

    this.cellSize = cellSize;
    this.createBoard = _createBoard;
    this.cellFactory = cellFactory;
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Coords(x, y) {
    this.x = x;
    this.y = y;
    this.toString = () => {
        return x + ", " + y
    }
}

/**
 *
 * @type {{createCoords: function(number, number): Coords, isCoords(Object): boolean}}
 */
let CoordsFactory = (() => {

    /**
     *
     * @param {number} x
     * @param {number} y
     * @returns {Coords}
     * @private
     */
    let _createCoords = (x, y) => {
        x = Number(x);
        y = Number(y);

        return new Coords(x, y)
    };

    /**
     *
     * @param {Object} subject
     * @returns {boolean}
     * @deprecated
     * @private
     */
    let _isCoords = (subject) => {
        return subject instanceof Coords;
    };

    return {
        createCoords: _createCoords,
        isCoords: _isCoords
    }

})();

/**
 * Q: 'But Jan, why would you have both a Size- ánd a Coords-class?'
 * A: Surface-area-calculations. TODO
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Size(x, y) {
    this.x = x;
    this.y = y;
}

/**
 *
 * @param {string} data
 * @return {Size}
 */
Size.parse = (data) => {
    let array = data.split(",");

    let xSize = Number(array[0].replace(new RegExp("[^0-9]"), ""));
    let ySize = Number(array[1].replace(new RegExp("[^0-9]"), ""));

    return new Size(xSize, ySize);
};


/**
 * @param {Size} boardSize
 * @constructor
 */
function Scenario(boardSize) {

    /**
     *
     * @param {Piece} piece
     * @param {Coords} coords
     */
    this.addPiece = (piece, coords) => {
        if (!coords instanceof Coords) throw new Error("Coords not coords");

        piece.position = coords;

        if (this.startingPiecesCoords[piece.colour] == null) this.startingPiecesCoords[piece.colour] = [];

        this.startingPiecesCoords[piece.colour].push(piece.position);
    };

    /**
     *
     * @param {Player} player
     * @param {string} colour
     */
    this.addPlayer = (player, colour) => {
        this.players[colour] = player;
    };

    this.boardSize = boardSize;
    this.startingPiecesCoords = [];
    this.players = [];
}

/**
 *
 * @param {string} colour
 * @param {SVGCircleElement} element
 * @constructor
 */
function Piece(colour, element) {
    this.colour = colour;
    this.position = null;
    this.element = element;
    this.onClick = null;
}

/**
 *
 * @param {Board} board
 * @param {Player} clientPlayer
 * @constructor
 */
function Game(board, clientPlayer) {


    Object.keys(board.cells).forEach(/** @param {string} coordinate **/coordinate => {
        /**
         * @var {Cell} cell
         */
        let cell = board.cells[coordinate];
        cell.onRightClick = () => {
            if (!clientPlayer.ownsPiece(clientPlayer.selectedPiece)) return;

            let newPiece = GameLoader.pieceFactory.createPiece(clientPlayer.colour);

            ReversiAPI.makeMove(clientPlayer.selectedPiece.position, cell.coords).then(ReversiAPI.pieceAPI.getPieces)
            //     .then(response => {
            //     console.log(response);
            //     switch (response.status) {
            //         case 200:
            //             console.log(response.body);
            //             board.spawnPiece(newPiece, cell.coords);
            //             break;
            //         default:
            //             console.log(response.body);
            //             break;
            //     }
            // });
        }
    });

    /**
     *
     * @param {Player} player
     */
    this.addPlayer = (player) => {
        if (player.colour in this.players) throw new Error(player.colour + " already exists");
        this.players[player.colour] = player;
    };

    /**
     *
     * @param {Player} player
     */
    this.getPlayerPieces = (player) => {

        /**
         *
         * @param {Piece} piece
         */
        let pieceFinder = (piece) => {
            return piece.colour === player.colour;
        };
        return this.pieces.find(pieceFinder);
    };

    this.pieces = [];
    this.board = board;
    this.players = [];
    this.clientPlayer = clientPlayer;
}

/**
 * @param {string} username
 * @param {string} colour
 * @constructor
 */
function Player(username, colour) {
    this.username = username;
    this.pieces = [];
    this.colour = colour;

    /**
     * Selects piece
     * @param {Piece} piece
     */
    this.selectPiece = (piece) => {
        this.deselectPiece();
        this.selectedPiece = piece;
        piece.element.setAttributeNS(null, "stroke-width", ".5");
        piece.element.setAttributeNS(null, "stroke", "white")
    };
    /**
     * Deselects piece
     */
    this.deselectPiece = () => {
        if (this.selectedPiece == null) return;

        this.selectedPiece.element.setAttributeNS(null, "stroke", "");
        this.selectedPiece = null;
    };

    /**
     *
     * @param {Piece} piece
     */
    this.ownsPiece = (piece) => {
        if (piece == null) return false;

        return this.colour === piece.colour;
    }

}

let ReversiAPI = (() => {

    let _startNewGame = (scenarioId) => {
        return new Promise(() => {
            window.fetch(
                "http://localhost:5000/api/game",
                {
                    method: "POST",
                    mode: "cors",
                    body: encodeURIComponent(JSON.stringify(scenarioId)),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).then((response) => {
                let reader = response.body.getReader();
                reader.read().then((object) => {
                    if (object.done) return;

                    let boardData = JSON.parse(new TextDecoder("utf-8").decode(object.value));
                    console.log(boardData);

                    let pieces = boardData.pieces;


                }).catch(console.log);
            });
        });
    };


    /**
     *
     * @return {Promise<Board>}
     * @private
     */
    let _getPieces = () => {

        return new Promise((resolve) => {
            window.fetch(
                "http://localhost:5000/api/board",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {},
                }
            ).then((response) => {
                let reader = response.body.getReader();
                reader.read().then((object) => {
                    if (object.done) return;

                    let boardData = JSON.parse(new TextDecoder("utf-8").decode(object.value));
                    console.log(boardData);

                    let pieces = boardData.pieces;

                    resolve(pieces);
                }).catch(console.log);
            });
        });
    };

    /**
     *
     * @param {Coords} from
     * @param {Coords} to
     * @return {Promise} request
     * @private
     */
    let _makeMove = (from, to) => {

        let body = {
            from: {
                x: from.x,
                y: from.y
            },
            to: {
                x: to.x,
                y: to.y
            }
        };

        return window.fetch(
            "http://localhost:5000/api/move",
            {
                method: "POST",
                body: encodeURIComponent(JSON.stringify(body)),
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            }
        );
    };

    /**
     *
     * @param {number} scenarioId
     * @return {Promise<Scenario>}
     * @private
     */
    let _getScenario = (scenarioId) => {

        if (isNaN(scenarioId))
            throw new Error("Invalid input");

        scenarioId = Number(scenarioId);

        // body = {
        //     "test"
        // };

        return new Promise((resolve, reject) => { //TODO type checking, rejecting, etc.
                window.fetch(
                    "http://localhost:5000/api/scenario/" + scenarioId,
                    {
                        method: "GET",
                        mode: "cors",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }).then((response) => {

                    let reader = response.body.getReader();
                    reader.read().then((object) => {
                        if (object.done) return;

                        let scenarioData = JSON.parse(new TextDecoder("utf-8").decode(object.value));
                        console.log(scenarioData);

                        let boardSize = Size.parse(scenarioData.boardSize);

                        let scenario = new Scenario(boardSize);

                        scenarioData.players.forEach((player) => {
                            let colour;

                            switch (player.colour) { //TODO cleanup. this is horrid
                                case 0:
                                    colour = "green";
                                    break;
                                case 1:
                                    colour = "blue";
                                    break;
                                default:
                                    colour = "yellow";
                                    break;

                            }

                            let newPlayer = new Player("FIXME", colour);

                            scenario.addPlayer(newPlayer, colour);

                            player.pieces.forEach(piece => {
                                let newPiece = GameLoader.pieceFactory.createPiece(colour);
                                let coords = CoordsFactory.createCoords(piece.position.x, piece.position.y);

                                scenario.addPiece(newPiece, coords);
                            });
                        });

                        resolve(scenario);

                    }).catch(console.log);
                });

            }
        );

    };

    return {
        makeMove: _makeMove,
        getScenario: _getScenario,

        pieceAPI: {
            getPieces: _getPieces
        },
        gameAPI: {
            startNewGame: _startNewGame()
        }
    }

})();

let GameLoader = (() => {
    const CELL_SIZE = 10;
    const PIECE_PERCENT_OF_CELL = .8;

    let _pieceFactory = (() => {
        /**
         *
         * @param {string} colour
         * @returns {SVGCircleElement}
         * @private
         */
        let _createPieceElement = (colour) => {
            let element = document.createElementNS(SVG_NAMESPACE, "circle");

            let cell_attributes = {
                r: CELL_SIZE * PIECE_PERCENT_OF_CELL / 2,
                style: "fill:" + colour
            };

            Util.setAttributesNS(element, cell_attributes);
            return element;
        };
        /**
         *
         * @param {string} colour
         * @param {function} onClick
         * @returns {Piece}
         * @private
         */
        let _createPiece = (colour, onClick = null) => {
            let piece = new Piece(colour, _createPieceElement(colour));

            piece.onClick = onClick;

            piece.element.addEventListener("click", () => {
                piece.onClick(piece)
            });
            return piece;
        };

        return {
            createPiece: _createPiece
        }

    })();

    let _cellFactory = new CellFactory(CELL_SIZE, () => {
        console.log()
    });

    let _boardFactory = new BoardFactory(CELL_SIZE, _cellFactory);

    /**
     *
     * @param {Scenario} scenario
     * @param {Player} clientPlayer
     * @return {Game} game
     * @private
     */
    let _loadScenario = (scenario, clientPlayer) => {
        let board = _boardFactory.createBoard(scenario.boardSize.x, scenario.boardSize.y);

        Object.keys(scenario.startingPiecesCoords).forEach(playerColour => {

            let coordsArray = scenario.startingPiecesCoords[playerColour];

            coordsArray.forEach(coords => {

                let piece = _pieceFactory.createPiece(playerColour, /** @param {Piece} piece**/(piece) => {
                    clientPlayer.selectPiece(piece);
                    console.log("Piece at " + coords + " selected!")
                });

                board.spawnPiece(piece, coords);
            });


        });

        return new Game(board, clientPlayer);
    };

    return {
        boardFactory: _boardFactory,
        pieceFactory: _pieceFactory,
        loadScenario: _loadScenario
    }
})();