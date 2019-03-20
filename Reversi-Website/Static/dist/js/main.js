"use strict";

var Reversi = function () {

    var _gameTarget = void 0;

    var _clientPlayer = void 0;

    var _initPlayer = function _initPlayer(player) {
        _clientPlayer = player;
    };

    var loadScenario = function loadScenario(scenario) {

        var player = _clientPlayer;

        /**@param {Reversi.Game} game**/
        var addEventListeners = function addEventListeners(game) {
            Reversi.Data.moveMade.subscribe(game.updateState);

            player.onSelectionChanged.subscribe(game.view.update);

            game.stateUpdated.subscribe(function () {
                Object.values(game.board.cells).forEach(function (cell) {
                    cell.onRightClick = function () {
                        if (!player.ownsPiece(player.selectedPiece)) return;

                        Reversi.Data.makeMove(player.selectedPiece.position, cell.coords);
                    };
                });

                game.pieces.forEach(function (piece) {
                    return piece.onClick.subscribe(function () {
                        return player.selectPiece(piece);
                    });
                });
            });
            game.stateUpdated.subscribe(game.view.update);
        };

        var game = GameFactory.fromScenario(scenario);

        game.addPlayer(player);

        addEventListeners(game);

        return game.updateState().then(function () {
            return game;
        });
    };

    /**
     *
     * @param {Event} event
     * @private
     */
    var _onSelectScenario = function _onSelectScenario(event) {
        event.preventDefault();

        /**
         *
         * @type {number}
         */
        var scenarioId = Number(document.getElementById("scenario-selector").value);

        return Reversi.Data.openLobby().then(function () {
            return Reversi.Data.gameAPI.startNewGame(scenarioId);
        }).then(Reversi.Data.fetchScenario).then(loadScenario).then(_initGameBoard); //TODO catch
    };

    var _initGameBoard = function _initGameBoard(game) {
        // Reversi.LongPollDevice.watch("api/game/update", "gameUpdate");
        // Reversi.LongPollDevice.subscribe("gameUpdate");

        while (_gameTarget.firstChild != null) {
            _gameTarget.removeChild(_gameTarget.firstChild);
        }

        var boardSVG = game.view;

        _gameTarget.appendChild(boardSVG.element);
        boardSVG.render();
    };

    var loadLobbies = function loadLobbies() {
        var target = document.getElementById("lobby-list");

        var createLobbyListItem = function createLobbyListItem(lobby) {
            var element = document.createElement("li");

            element.innerText = "Id: " + lobby.id;

            return element;
        };

        var loadLobby = function loadLobby(lobby) {
            var element = createLobbyListItem(lobby);

            element.onclick = function () {
                return Reversi.Data.joinLobby(lobby.id);
            };

            target.appendChild(element);
        };

        Reversi.Data.fetchLobbies().then(function (lobbies) {
            return lobbies.forEach(loadLobby);
        });
    };

    /**
     *
     * @param {HTMLDivElement} target
     * @private
     */
    var _init = function _init(target) {
        Reversi.Data.init();
        Reversi.LongPollDevice.init();

        _gameTarget = target;

        var name = prompt("What is your name?"); //FIXME temp

        var colour = void 0;
        do {
            colour = prompt("What colour do you want to be? Hex pls", "FFFFFF");
        } while (!colour.match(/^[0-9A-F]{6}$/));

        var player = new Reversi.Player(name, "#".concat(colour));

        _initPlayer(player);

        /**
         *
         * @type {HTMLFormElement}
         */
        var scenarioForm = document.getElementById("scenario-form");

        scenarioForm.addEventListener("submit", _onSelectScenario);

        loadLobbies();

        Reversi.Data.lobbyJoined.subscribe(function () {
            Reversi.Data.fetchCurrentGame().then(function (game) {
                var size = Reversi.Size.parse(game.boardInfo.size);

                return new Reversi.Scenario(size);
            }).then(loadScenario).then(_initGameBoard);
        });
    };

    return {
        init: _init
    };
}();
"use strict";

var FeedbackWidget = function () {

    /**
     *
     * @param {string} type
     * @param {string} title
     * @param {string} content
     * @returns {{feedbackType: *, title: *, content: string, coords: number[], element: null, close: function, display: (function(number, number): (null|HTMLElement)), toElement: (function(): HTMLElement)}}
     * @private
     */
    var _createNotification = function _createNotification(type, title) {
        var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

        var _type = type;
        var _title = title;
        var _content = content;

        var _toElement = function _toElement() {
            var feedbackWidgetClass = void 0;
            switch (_type) {//TODO find a better way of doing this
                case "positive":
                    feedbackWidgetClass = "feedback-widget-positive";
                    break;
                case "negative":
                    feedbackWidgetClass = "feedback-widget-negative";
                    break;
                default:
                case "neutral":
                    feedbackWidgetClass = "feedback-widget-neutral";
                    break;
            }

            var x = undefined.coords[0];
            var y = undefined.coords[1];

            var element = document.createElement("div");
            element.classList.add("feedback-widget", feedbackWidgetClass);
            Object.assign(element.style, {
                position: "sticky",
                left: x + "px",
                top: y + "px"
            });

            var titleElement = document.createElement("span");
            titleElement.classList.add("feedback-widget-title");
            titleElement.innerHTML = _title;
            element.appendChild(titleElement);

            var contentElement = document.createElement("span");
            contentElement.classList.add("feedback-widget-content");
            contentElement.innerHTML = _content;
            element.appendChild(contentElement);

            //  TODO make single class out of this.
            var closeButtonSize = 15;
            var closeButton = document.createElement("span");
            closeButton.innerHTML = "&#10761;"; //Cross-symbol
            Object.assign(closeButton.style, {
                //position in relation to parent element
                position: "absolute",
                right: "10px", //TODO find a way to make this dynamic
                top: "10px",
                //make x- and y-diameter equal
                width: closeButtonSize + "px",
                height: closeButtonSize + "px",
                //centre text
                textAlign: "center",
                lineHeight: closeButtonSize + "px",
                fontSize: closeButtonSize + "px",
                //make 'button' into circle with black border
                border: "1px solid black",
                borderRadius: closeButtonSize + "px",
                cursor: "pointer",
                backgroundColor: "#E6E6E6"
            });
            closeButton.addEventListener("click", _close); //close parent when clicked
            element.appendChild(closeButton);

            return element;
        };

        /**
         * @description closes current element (this.element)
         * @private
         */
        var _close = function _close() {
            if (undefined.element == null) return;

            undefined.element.parentNode.removeChild(undefined.element);
        };

        var _display = function _display(x, y) {
            undefined.coords = [x, y];
            undefined.element = _toElement();
            return undefined.element; //TODO refactor
        };

        return {
            feedbackType: _type,
            title: _title,
            content: _content,
            coords: [0, 0],
            element: null,

            close: _close,
            display: _display
        };
    };

    var currentScriptPath = document.currentScript.src;
    var currentScriptDirectory = currentScriptPath + "/..";

    var _cssElementId = "feedback-widget-css";
    /**
     * Path to
     * @type {string}
     * @private
     */
    var _cssElementHref = currentScriptDirectory + "/../assets/feedback-widget.css";

    // TODO let _includeFiles

    var _init = function _init() {

        if (document.getElementById(_cssElementId) != null) return true;

        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.id = _cssElementId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = _cssElementHref;

        head.appendChild(link);

        return true;
    };

    return {
        createNotification: _createNotification,
        init: _init
    };
}();
"use strict";

/**
 *
 * @param {Reversi.CellFactory} cellFactory
 * @constructor
 */
Reversi.BoardFactory = function (cellFactory) {

    /**
     *
     * @param {number} width: the width in cells
     * @param {number} height: the height in cells
     * @returns {Board}
     */
    this.createBoard = function (width, height) {
        var rows = [];
        for (var rowIndex = 0; rowIndex < height; rowIndex++) {
            var _cells = [];
            for (var columnIndex = 0; columnIndex < width; columnIndex++) {
                var coords = new Reversi.Coords(rowIndex, columnIndex);

                _cells[columnIndex] = cellFactory.createCell(coords);
            }
            rows[rowIndex] = _cells;
        }

        var cells = [];
        rows.forEach(function (row) {
            return row.forEach(function (cell) {
                return cells[cell.coords.toString()] = cell;
            });
        });

        return new Reversi.Board(new Reversi.Size(width, height), cells);
    };
};
"use strict";

/**
 *
 * @param {Size} boardSize
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
"use strict";

/**
 *
 * @constructor
 */
Reversi.CellFactory = function () {

  /**
   *
   * @param {Reversi.Coords} coords
   * @returns {Reversi.Cell}
   */
  this.createCell = function (coords) {
    var colour = (coords.x + coords.y) % 2 === 1 ? "red" : "brown"; //TODO make cell colours dynamic

    return new Reversi.Cell(coords, colour);
  };
};
"use strict";

/**
 *
 * @param {Coords} coords
 * @param {string} colour
 * @param {Reversi.Piece} occupant
 * @constructor
 */
Reversi.Cell = function (coords, colour) {
  var occupant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  this.coords = coords;
  this.colour = colour;
  this.occupant = occupant;
  this.onClick = null;
  this.onRightClick = null;
};
"use strict";

/**
 *
 * @param {number} x
 * @param {number} y
 * @constructor
 */
Reversi.Coords = function (x, y) {
  /**
   *
   * @type {number}
   */
  this.x = x;

  /**
   *
   * @type {number}
   */
  this.y = y;

  /**
   * @description returns 'x, y'
   * @return {string}
   */
  this.toString = function () {
    return x + ", " + y;
  };
};
/**
 *
 * @param {string} input
 * @returns {Coords}
 */
Reversi.Coords.parse = function (input) {

  var input_split = input.split(",");

  var isCorrectLength = input_split.length === 2;

  var isCorrectType = true;

  input_split.map(function (item) {
    item = item.trim();

    if (isNaN(Number(item))) isCorrectType = false;
  });

  if (!isCorrectLength || !isCorrectType) throw new Error("Incorrect input: " + input);

  var x = Number(input_split[0]);
  var y = Number(input_split[1]);

  return new Reversi.Coords(x, y);
};
"use strict";

/**
 * Q: 'But Jan, why would you have both a Size- ánd a Coords-class?'
 * A: Surface-area-calculations.
 * @param {number} x
 * @param {number} y
 * @constructor
 */
Reversi.Size = function (x, y) {
    var _this = this;

    this.x = x;
    this.y = y;

    this.getArea = function () {
        return _this.x * _this.y;
    };
};

/**
 *
 * @description parses string 'x,y', returns Size
 * @param {string} data
 * @return {Reversi.Size}
 */
Reversi.Size.parse = function (data) {
    var array = data.split(",");

    var xSize = Number(array[0].replace(new RegExp("[^0-9]"), ""));
    var ySize = Number(array[1].replace(new RegExp("[^0-9]"), ""));

    return new Reversi.Size(xSize, ySize);
};
"use strict";

/**
 *
 * @param {string} colour
 * @constructor
 */
Reversi.PieceFactory = function (colour) {
  var _this = this;

  if (colour == null) throw new Error("colour cannot be null");

  colour = colour.replace("#", "");
  if (!colour.match(/^[0-9A-F]{6}$/)) throw new Error("Invalid hex colour code");

  this.colour = "#".concat(colour);

  /**
   *
   * @returns {Reversi.Piece}
   */
  this.createPiece = function () {
    return new Reversi.Piece(_this.colour);
  };
};
"use strict";

/**
 *
 * @param {string} colour
 * @constructor
 */
Reversi.Piece = function (colour) {
    var _this = this;

    var eventEmitter = new Reversi.EventEmitter();

    var eventNames = {
        leftClick: "click-left"
    };

    /**
     *
     * @type {string}
     */
    this.colour = colour;

    /**
     *
     * @type {Coords}
     */
    this.position = null;

    /**
     *
     * @type {Reversi.EventSubscriber}
     */
    this.onClick = new Reversi.EventSubscriber(eventNames.leftClick, eventEmitter);

    this.click = function () {
        eventEmitter.emit(eventNames.leftClick);
    };

    /**
     *
     * @type {boolean}
     */
    this.isSelected = false;

    this.select = function () {
        _this.isSelected = true;
    };

    this.deselect = function () {
        _this.isSelected = false;
    };

    this.toggleSelect = function () {
        _this.isSelected = !_this.isSelected;
    };
};
"use strict";

/**
 *
 * @type {{makeMove, getScenario, pieceAPI, gameAPI}}
 */
Reversi.Data = function () {

    var API_HOST = "http://localhost:5000";

    var eventEmitter = void 0;

    var eventNames = {
        moveMade: "move-made",
        lobbyOpened: "lobby-opened",
        lobbyJoined: "lobby-joined"
    };

    var sessionId = void 0;

    var _startNewGame = function _startNewGame(scenarioId) {
        var body = encodeURIComponent(scenarioId);

        return window.fetch(API_HOST + "/api/game", {
            method: "POST",
            mode: "cors",
            body: body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "session-id": sessionId
            }
        }).then(function (response) {
            return response.ok ? scenarioId : Promise.reject();
        });
    };

    var _fetchCurrentGame = function _fetchCurrentGame() {
        return window.fetch(API_HOST + "/api/game", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "session-id": sessionId
            }
        }).then(function (response) {
            return response.ok ? response.json() : Promise.reject();
        });
    };

    var _openLobby = function _openLobby() {
        return window.fetch(API_HOST + "/api/lobbies", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "session-id": sessionId
            }
        }).then(function (response) {
            if (!response.ok) return Promise.reject();

            eventEmitter.emit(eventNames.lobbyOpened);
            return Promise.resolve(response);
        });
    };

    var _joinLobby = function _joinLobby(lobbyId) {
        return window.fetch(API_HOST + "/api/lobbies/" + lobbyId, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "session-id": sessionId
            }
        }).then(function (response) {
            if (!response.ok) return Promise.reject();

            eventEmitter.emit(eventNames.lobbyJoined);
            return Promise.resolve(response);
        });
    };

    var _fetchSessionId = function _fetchSessionId() {
        return window.fetch(API_HOST + "/api/session", {
            method: "GET",
            mode: "cors"
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            return Promise.resolve(json.sessionId);
        });
    };

    /**
     *
     * @return {Promise<Response>}
     * @private
     */
    var _fetchBoardState = function _fetchBoardState() {
        var headers = new Headers({
            "session-id": sessionId
        });
        //TODO preprocess to NEW BoardState-model
        return window.fetch(API_HOST + "/api/board", {
            method: "GET",
            mode: "cors",
            headers: headers
        });
    };

    /**
     *
     * @return {Promise<Array<string, Array<Reversi.Coords>>>}
     * @private
     */
    var _getPieceCoordinates = function _getPieceCoordinates() {
        var parseResponse = function parseResponse(response) {
            var reader = response.body.getReader();

            return reader.read().then(function (object) {

                var boardData = JSON.parse(new TextDecoder("utf-8").decode(object.value));

                var colourPieces = [];

                boardData.pieces.forEach(function (piece) {
                    if (!Object.keys(colourPieces).includes(piece.colour)) colourPieces[piece.colour] = [];

                    colourPieces[piece.colour].push(new Reversi.Coords(piece.position.x, piece.position.y));
                });

                return Promise.resolve(colourPieces);
            });
        };

        return _fetchBoardState().then(parseResponse);
    };

    /**
     *
     * @param {Coords} from
     * @param {Coords} to
     * @return {Promise} request
     * @private
     */
    var _makeMove = function _makeMove(from, to) {

        var constructURIString = function constructURIString(object) {
            var outputArray = [];

            Object.keys(object).map(function (key) {
                key = encodeURIComponent(key);
                var value = encodeURIComponent(object[key]);
                outputArray.push(key + "=" + value);
            });

            return outputArray.join("&");
        };

        var body = {
            FromX: Number(from.x),
            FromY: Number(from.y),

            ToX: Number(to.x),
            ToY: Number(to.y)
        };

        var headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "session-id": sessionId
        });

        return window.fetch(API_HOST + "/api/move", {
            method: "POST",
            mode: "cors",
            body: constructURIString(body),
            headers: headers
        }).then(function (response) {
            if (response.ok) return Promise.resolve();

            return Promise.reject();
        }).then(function () {
            return eventEmitter.emit(eventNames.moveMade);
        });
    };

    /**
     *
     * @param {number} scenarioId
     * @return {Promise<Scenario>}
     * @private
     */
    var _getScenario = function _getScenario(scenarioId) {

        if (isNaN(scenarioId)) throw new Error("Invalid input");

        scenarioId = Number(scenarioId);

        /**
         *
         * @param {ReadableStreamReadResult} object
         * @returns {Reversi.Scenario}
         */
        var processStreamToScenario = function processStreamToScenario(object) {
            var scenarioData = JSON.parse(new TextDecoder("utf-8").decode(object.value));

            var boardSize = Reversi.Size.parse(scenarioData.boardSize);

            var scenario = new Reversi.Scenario(boardSize);

            Object.keys(scenarioData.startingPositions).map(function (coordsString) {

                var colour = scenarioData.startingPositions[coordsString];

                colour = colour.split()[0] === "#" ? colour : "#".concat(colour);

                coordsString = coordsString.replace("(", "").replace(")", "");

                var coords = Reversi.Coords.parse(coordsString);

                scenario.addPiece(colour, coords);
            });

            return scenario;
        };
        //TODO type checking, rejecting, etc.

        return window.fetch(API_HOST + "/api/scenario/" + scenarioId, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {

            var reader = response.body.getReader();

            return reader.read().then(function (object) {
                var scenario = processStreamToScenario(object);

                if (scenario == null) return Promise.reject();

                return Promise.resolve(scenario);
            });
        });
    };

    var _fetchScenarioIds = function _fetchScenarioIds() {
        return window.fetch(API_HOST + "/api/scenario", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {

            var reader = response.body.getReader();

            return reader.read().then(function (object) {
                var scenarios = object;

                if (scenarios == null) return Promise.reject();

                return Promise.resolve(scenarios);
            });
        });
    };

    var _fetchLobby = function _fetchLobby(id) {
        return window.fetch(API_HOST + "/api/lobbies/" + id, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {

            var reader = response.body.getReader();

            return reader.read().then(function (object) {
                var scenarios = object;

                if (scenarios == null) return Promise.reject();

                return Promise.resolve(scenarios);
            });
        });
    };

    var _fetchLobbies = function _fetchLobbies() {
        return window.fetch(API_HOST + "/api/lobbies", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            return response.json();
        });
    };

    /**
     *
     * @private
     */
    var _init = function _init() {
        eventEmitter = new Reversi.EventEmitter();

        object.moveMade = new Reversi.EventSubscriber(eventNames.moveMade, eventEmitter);
        object.lobbyOpened = new Reversi.EventSubscriber(eventNames.lobbyOpened, eventEmitter);
        object.lobbyJoined = new Reversi.EventSubscriber(eventNames.lobbyJoined, eventEmitter);

        //TODO fetch UserInformation

        _fetchSessionId().then(function (id) {
            return sessionId = id;
        });
    };

    var object = {
        API_HOST: API_HOST,
        init: _init,
        makeMove: _makeMove,

        fetchScenario: _getScenario,
        fetchScenarioIds: _fetchScenarioIds,

        fetchLobby: _fetchLobby,
        fetchLobbies: _fetchLobbies,
        openLobby: _openLobby,

        joinLobby: _joinLobby,

        pieceAPI: {
            getPieceCoordinates: _getPieceCoordinates
        },

        fetchCurrentGame: _fetchCurrentGame,
        gameAPI: {
            startNewGame: _startNewGame

        }
    };

    return object;
}();
"use strict";

Reversi.LongPollDevice = function () {
    var eventEmitter = void 0;

    var _init = function _init() {
        eventEmitter = new Reversi.EventEmitter();
    };

    var _sendRequest = function _sendRequest(url) {
        return window.fetch(url, {
            headers: {
                "Connection": "Keep-Alive"
            }
        });
    };

    var _watch = function _watch(url, eventName) {
        var startRequest = function startRequest() {
            return _sendRequest(url).then(eventEmitter.emit(eventName));
        };

        eventEmitter.subscribe(eventName, startRequest);

        startRequest();
    };

    return {
        init: _init,
        watch: _watch,
        subscribe: function subscribe(eventName, callback) {
            return eventEmitter.subscribe(eventName, callback);
        },
        unsubscribe: function unsubscribe(eventName, callback) {
            return eventEmitter.unsubscribe(eventName, callback);
        }
    };
}();
"use strict";

Reversi.EventEmitter = function () {
    /**
     *
     * @type {Array<string, Array<function>>}
     */
    var eventCallbacks = [];

    /**
     *
     * @param {string} eventName
     * @param {function} callback
     */
    this.subscribe = function (eventName, callback) {
        if (!Object.keys(eventCallbacks).includes(eventName)) eventCallbacks[eventName] = [];

        eventCallbacks[eventName].push(callback);
    };

    /**
     *
     * @param {string} eventName
     * @param {function} callback
     */
    this.unsubscribe = function (eventName, callback) {
        if (!Object.keys(eventCallbacks).includes(eventName)) return;
        if (!eventCallbacks[eventName].includes(callback)) return;

        var callbackList = eventCallbacks[eventName];

        callbackList.splice(callbackList.indexOf(callback), 1);

        eventCallbacks[eventName] = callbackList;
    };

    /**
     *
     * @param {string} eventName
     */
    this.emit = function (eventName) {
        if (!Object.keys(eventCallbacks).includes(eventName)) return;

        eventCallbacks[eventName].forEach(function (item) {
            return item.call();
        });
    };
};
"use strict";

/**
 *
 * @param {string} eventName
 * @param {Reversi.EventEmitter} eventEmitter
 * @constructor
 */
Reversi.EventSubscriber = function (eventName, eventEmitter) {
  this.subscribe = function (callback) {
    return eventEmitter.subscribe(eventName, callback);
  };
  this.unsubscribe = function (callback) {
    return eventEmitter.unsubscribe(eventName, callback);
  };
};
"use strict";

var GameFactory = function () {
    var _cellFactory = new Reversi.CellFactory();

    var _boardFactory = new Reversi.BoardFactory(_cellFactory);

    /**
     *
     * @param {Reversi.Scenario} scenario
     * @return {Reversi.Game} game
     * @private
     */
    var _fromScenario = function _fromScenario(scenario) {
        var board = _boardFactory.createBoard(scenario.boardSize.x, scenario.boardSize.y);

        return new Reversi.Game(board);
    };

    return {
        fromScenario: _fromScenario
    };
}();
"use strict";

/**
 *
 * @param {Board} board
 * @constructor
 */
Reversi.Game = function (board) {
    var _this = this;

    var eventEmitter = new Reversi.EventEmitter();

    var eventNames = {
        stateUpdated: "state-updated"
    };

    this.stateUpdated = new Reversi.EventSubscriber(eventNames.stateUpdated, eventEmitter);

    /**
     *
     * @returns {Promise<void>}
     */
    this.updateState = function () {

        /**
         *
         * @param {Array<string, Array<Reversi.Coords>>} colourPieces
         */
        var createPieces = function createPieces(colourPieces) {
            var pieces = [];

            //  Calculates 2d array of coordinates keyed by colour to 1d-array of Pieces
            Object.keys(colourPieces).forEach(function (colour) {
                var factory = new Reversi.PieceFactory(colour);

                var coordsArray = colourPieces[colour];

                pieces.concat(coordsArray.forEach(function (coords) {
                    var piece = factory.createPiece();
                    piece.position = coords;

                    pieces.push(piece);
                }));
            });

            return pieces;
        };

        return Reversi.Data.pieceAPI.getPieceCoordinates().then(createPieces).then(_this.setPieces).then(function () {
            return eventEmitter.emit(eventNames.stateUpdated);
        });
    };

    var clearBoard = function clearBoard() {
        while (_this.pieces.length > 0) {
            var piece = _this.pieces.shift();

            _this.despawnPiece(piece);
        }
    };

    /**
     *
     * @param {Array<Piece>} pieces
     */
    this.setPieces = function (pieces) {
        clearBoard();

        pieces.forEach(function (piece) {
            return _this.spawnPiece(piece, piece.position);
        });
    };

    /**
     *
     * @param {Reversi.Player} player
     */
    this.addPlayer = function (player) {
        if (player.colour in _this.players) throw new Error(player.colour + " already exists");

        _this.players[player.colour()] = player;

        _this.pieces.filter(function (piece) {
            return piece.colour === player.colour();
        }).forEach(function (item) {
            return player.pieces.push(item);
        });
    };

    /**
     *
     * @param {Reversi.Player} player
     */
    this.getPlayerPieces = function (player) {

        /**@param {Reversi.Piece} piece*/
        var pieceFinder = function pieceFinder(piece) {
            return piece.colour === player.colour();
        };
        return _this.pieces.filter(pieceFinder);
    };

    /**
     *
     * @param {Reversi.Piece} piece
     * @param {Reversi.Coords} coords
     */
    this.spawnPiece = function (piece, coords) {
        if (piece == null || coords == null) throw new Error("Invalid input");

        var targetCell = _this.board.cells[coords];
        if (targetCell.occupant != null) throw new Error("Cell already occupied");

        piece.position = coords;
        targetCell.occupant = piece;

        _this.pieces.push(piece);
    };

    /**
     *
     * @param {Reversi.Piece} piece
     */
    this.despawnPiece = function (piece) {
        _this.board.cells[piece.position].occupant = null;

        if (!_this.pieces.includes(piece)) return;

        _this.pieces.splice(_this.pieces.indexOf(piece), 1);
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
"use strict";

/**
 * @param {string} username
 * @param {string} colour
 * @constructor
 */
Reversi.Player = function (username, colour) {
    var _this = this;

    var eventEmitter = new Reversi.EventEmitter();

    var eventNames = {
        selectionChanged: "selection-changed"
    };

    this.username = username;
    this.pieces = [];

    var _colour = colour;

    this.colour = function () {
        return _colour;
    };

    this.onSelectionChanged = new Reversi.EventSubscriber(eventNames.selectionChanged, eventEmitter);

    /**
     * Selects piece
     * @param {Reversi.Piece} piece
     */
    this.selectPiece = function (piece) {
        _this.deselectPiece();
        _this.selectedPiece = piece;
        piece.select();

        eventEmitter.emit(eventNames.selectionChanged);
    };

    /**
     * Deselects piece
     */
    this.deselectPiece = function () {
        if (_this.selectedPiece == null) return;

        _this.selectedPiece.deselect();

        _this.selectedPiece = null;

        eventEmitter.emit(eventNames.selectionChanged);
    };

    /**
     *
     * @param {Reversi.Piece} piece
     */
    this.ownsPiece = function (piece) {
        if (piece == null) return false;

        return _this.colour() === piece.colour;
    };
};
"use strict";

/**
 * @param {Size} boardSize
 * @constructor
 */
Reversi.Scenario = function (boardSize) {
  var _this = this;

  /**
   *
   * @param {string} colour
   * @param {Coords} coords
   */
  this.addPiece = function (colour, coords) {
    if (_this.startingPiecesCoords[colour] == null) _this.startingPiecesCoords[colour] = [];

    _this.startingPiecesCoords[colour].push(coords);
  };

  /**
   *
   * @param {Player} player
   * @param {string} colour
   */
  this.addPlayer = function (player, colour) {
    _this.players[colour] = player;
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
"use strict";

/**
 *
 * @param {Reversi.Game} game
 * @constructor
 */
Reversi.BoardSVG = function (game) {
  var _this = this;

  var eventEmitter = new Reversi.EventEmitter();

  var eventNames = {
    update: "update"
  };

  var elementFactory = new Reversi.BoardElementFactory();

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
  this.renderPiece = function (piece) {
    var coords = piece.position;

    var pieceElement = elementFactory.createPieceElement(piece);

    _this.pieces[coords] = pieceElement;

    _this.element.appendChild(pieceElement);
  };

  /**
   *
   * @param {Reversi.Cell} cell
   */
  var renderCell = function renderCell(cell) {
    var element = elementFactory.createCellElement(cell);

    _this.cells[cell.coords] = element;

    _this.element.appendChild(element);
  };

  /**
   *
   */
  this.clear = function () {

    var removeByKey = function removeByKey(key) {
      return _this.element.removeChild(_this.pieces[key]);
    };

    Object.keys(_this.pieces).forEach(removeByKey);

    _this.pieces = [];
  };

  /**
   *
   */
  this.render = function () {
    var cells = [];

    var addByCoords = function addByCoords(coords) {
      return cells.push(_this.model.board.cells[coords]);
    };

    Object.keys(_this.model.board.cells).forEach(addByCoords);
    cells.forEach(renderCell);

    _this.update();
  };

  /**
   *
   * @type {{subscribe: (function(*=): void), unsubscribe: (function(*=): void)}}
   */
  this.updateInvoked = {
    subscribe: function subscribe(callback) {
      return eventEmitter.subscribe(eventNames.update, callback);
    },
    unsubscribe: function unsubscribe(callback) {
      return eventEmitter.unsubscribe(eventNames.update, callback);
    }
  };

  /**
   *
   */
  this.update = function () {
    _this.clear();
    _this.model.pieces.forEach(_this.renderPiece);

    eventEmitter.emit(eventNames.update);
  };
};
"use strict";

/**
 *
 */
Reversi.BoardElementFactory = function () {
    var _this = this;

    var CELL_SIZE = 10;
    var PIECE_PERCENT_OF_CELL = .8;
    var SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    /**
     *
     * @param {Reversi.Piece} piece
     * @returns {SVGCircleElement}
     */
    this.createPieceElement = function (piece) {
        var element = document.createElementNS(SVG_NAMESPACE, "circle");

        var adjustedCoords = new Reversi.Coords(piece.position.x + .5, piece.position.y + .5);

        var element_attributes = {
            r: CELL_SIZE * PIECE_PERCENT_OF_CELL / 2,
            style: "fill:" + piece.colour,
            cx: adjustedCoords.x * CELL_SIZE,
            cy: adjustedCoords.y * CELL_SIZE
            //NICER 'recalculate' these Coords through a Coords/CellCalculator of sorts.
        };

        element.addEventListener("click", function (event) {
            event.preventDefault();

            piece.click();
        });

        if (piece.isSelected) {
            element_attributes["stroke-width"] = ".5";
            element_attributes["stroke"] = "white";
        }

        Reversi.BoardElementFactory.SVGUtil.setAttributesNS(element, element_attributes);
        return element;
    };

    /**
     *
     * @param {Cell} cell
     * @returns {SVGRectElement}
     */
    this.createCellElement = function (cell) {
        var cellElement = document.createElementNS(SVG_NAMESPACE, "rect");

        var cell_attributes = {
            x: cell.coords.x * CELL_SIZE,
            y: cell.coords.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            style: "fill:" + cell.colour
        };

        Reversi.BoardElementFactory.SVGUtil.setAttributesNS(cellElement, cell_attributes);

        cellElement.addEventListener("click", function (event) {
            event.preventDefault();

            if (cell.onClick == null) return;

            cell.onClick();
        });

        cellElement.addEventListener("contextmenu", function (event) {
            event.preventDefault();

            if (cell.onRightClick == null) return;

            cell.onRightClick();
        });

        return cellElement;
    };

    /**
     *
     * @param {number} width
     * @param {number} height
     * @param {Array<Cell>} cells
     * @returns {SVGElement}
     */
    this.createBoardElement = function (width, height, cells) {
        var boardElement = document.createElementNS(SVG_NAMESPACE, "svg");

        cells.map(function (cell) {
            var element = _this.createCellElement(cell);

            boardElement.appendChild(element);
        });

        var realWidth = width * CELL_SIZE;
        var realHeight = height * CELL_SIZE;

        Reversi.BoardElementFactory.SVGUtil.setAttributesNS(boardElement, {
            viewBox: "0 0 " + realWidth + " " + realHeight
        });

        return boardElement;
    };
};
"use strict";

Reversi.BoardElementFactory.SVGUtil = function () {
    /**
     *
     * @param {Element} target
     * @param {Array | Object} attributes
     * @private
     */
    var setAttributesNS = function setAttributesNS(target, attributes) {
        if (!(target instanceof Element)) throw new Error("target not an HTMLElement");
        if (attributes instanceof Object) attributes = objectToArray(attributes);
        if (!(attributes instanceof Array)) throw new Error("target not an Array");

        for (var key in attributes) {
            target.setAttribute(key, attributes[key]);
        }
    };

    /**
     *
     * @param object
     * @returns {Array}
     * @private
     */
    var objectToArray = function objectToArray(object) {
        if (!(object instanceof Object)) throw new Error("target not an Object");

        var output_array = [];
        Object.keys(object).map(function (key) {
            output_array[key] = object[key];
        });

        return output_array;
    };

    return {
        objectToArray: objectToArray,
        setAttributesNS: setAttributesNS
    };
}();
"use strict";

/**
 *
 * @param {number} x
 * @param {number} y
 * @constructor
 */
FeedbackWidget.Coords = function (x, y) {
  /**
   *
   * @type {number}
   */
  this.x = x;

  /**
   *
   * @type {number}
   */
  this.y = y;

  /**
   * @description returns 'x, y'
   * @return {string}
   */
  this.toString = function () {
    return x + ", " + y;
  };
};
/**
 *
 * @param {string} input
 * @returns {Coords}
 */
FeedbackWidget.Coords.parse = function (input) {

  var input_split = input.split(",");

  var isCorrectLength = input_split.length === 2;

  var isCorrectType = true;

  input_split.map(function (item) {
    item = item.trim();

    if (isNaN(Number(item))) isCorrectType = false;
  });

  if (!isCorrectLength || !isCorrectType) throw new Error("Incorrect input: " + input);

  var x = Number(input_split[0]);
  var y = Number(input_split[1]);

  return new Coords(x, y);
};
"use strict";

function Notification(type, title, content) {

    switch (type) {//TODO find a better way of doing this
        case "positive":
        case "negative":
            this.type = type;
            break;
        default:
        case "neutral":
            this.type = "neutral";
            break;
    }
}