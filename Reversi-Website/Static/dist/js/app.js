"use strict";

var SPA = function () {

    var eventEmitter = void 0;

    var eventNames = {
        loggedIn: "logged-in"
    };

    var _login = function _login(loginObject) {
        SPA.Data.login(loginObject).then(function () {
            return eventEmitter.emit(eventNames.loggedIn);
        });
    };

    /**
     *
     * @param {Event} event
     * @private
     */
    var _onStartNewGame = function _onStartNewGame(event) {
        event.preventDefault();

        /**
         *
         * @type {number}
         */
        // let scenarioId = Number(document.getElementById("scenario-selector").value);
        var scenarioId = 0;

        return Reversi.startNewGame(scenarioId);
    };

    var _init = function _init() {
        eventEmitter = new EventModule.EventEmitter();

        object.events.login = new EventModule.EventSubscriber(eventNames.loggedIn, eventEmitter);

        SPA.Data.init();

        var target = document.getElementById("content");

        target.innerHTML = SPA_Templates.login.login({
            messageModel: {
                hasMessage: false,
                message: ""
            }
        });

        object.events.login.subscribe(function () {

            // Load new screen
            var lobbyList = SPA_Templates.reversi["lobby-list"]({
                lobbies: []
            });
            var gameBoard = SPA_Templates.reversi["game-board"]({});

            target.innerHTML = SPA_Templates.reversi["game-screen"]({
                lobbyList: lobbyList,
                gameBoard: gameBoard
            });

            var target_gameBoard = document.getElementById("game-board");

            //  Init reversi
            Reversi.init(target_gameBoard);

            /**
             *
             * @type {HTMLFormElement}
             */
            var newGameButton = document.getElementById("new-game-button");

            newGameButton.addEventListener("click", _onStartNewGame);

            Reversi.reloadLobbies();

            SPA.Data.lobbyJoined.subscribe(Reversi.initCurrentGame);

            SPA.Data.serverEvents["move-made"].subscribe(function () {
                FeedbackWidget.createNotification("positive", "move made").display();
            });
        });

        return true;
    };
    var object = {
        currentUser: null,
        init: _init,
        login: _login,
        events: {
            login: null
        }
    };

    return object;
}();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

SPA.Data = function () {
    var constructURIString = function constructURIString(object) {
        var outputArray = [];

        Object.keys(object).map(function (key) {
            key = encodeURIComponent(key);
            var value = encodeURIComponent(object[key]);
            outputArray.push(key + "=" + value);
        });

        return outputArray.join("&");
    };

    var API_HOST = "http://localhost:5000";

    var eventEmitter = void 0;

    var eventNames = {
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
            return response.ok ? response.json() : Promise.reject();
        }).then(function (data) {
            return Reversi.setPlayerColour(data.colour);
        });
    };

    /**
     *
     * @return {Promise<SPA.Data.GameDTO>}
     * @private
     */
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
        }).then(function (object) {
            return new SPA.Data.GameDTO(object);
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
            return !response.ok ? Promise.reject() : response.json();
        }).then(function (data) {
            Reversi.setPlayerColour(data.colour);

            eventEmitter.emit(eventNames.lobbyJoined);
            return data;
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
     * @param {{Username: string, PasswordHash: string}}loginObject
     * @return {Promise<Response | never>}
     * @private
     */
    var _login = function _login(loginObject) {
        var body = constructURIString(loginObject);
        return window.fetch(API_HOST + "/api/login", {
            method: "POST",
            body: body,
            headers: {
                "session-id": sessionId
            },
            mode: "cors"
        }).then(function (response) {
            SPA.currentUser = new SPA.User(loginObject.Username);
            return response.ok ? response.text() : Promise.reject();
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
     * @param {Reversi.Coords} from
     * @param {Reversi.Coords} to
     * @return {Promise} request
     * @private
     */
    var _makeMove = function _makeMove(from, to) {

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
        });
    };

    /**
     *
     * @return {Promise<Response>}
     * @private
     */
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

    var LongPollDevice = function () {
        /**
         * @type EventModule.EventEmitter
         */
        var _eventEmitter = void 0;

        var mappedEvents = [];

        var requestStarted = false;

        var url = API_HOST + "/api/session/updates";

        var _paused = false;

        var _pause = function _pause() {
            _paused = true;
        };

        var _unpause = function _unpause() {
            _paused = false;
        };

        /**
         *
         * @param url
         * @return {Promise<Response>}
         * @private
         */
        var _sendRequest = function _sendRequest(url) {
            return window.fetch(url, {
                headers: {
                    "Connection": "Keep-Alive",
                    "session-id": sessionId
                }
            });
        };

        var _checkUpdates = function _checkUpdates() {
            requestStarted = true;

            var startRequest = function startRequest() {
                return _sendRequest(url).then(function (request) {
                    return request.ok ? request.json() : Promise.reject();
                }).then(function (data) {
                    if (!(data instanceof Array)) return Promise.reject("Invalid data type: " + (typeof data === "undefined" ? "undefined" : _typeof(data)));

                    var callEvent = function callEvent(updateCode) {
                        updateCode = updateCode.toString();

                        if (!Object.keys(mappedEvents).includes(updateCode)) {
                            console.log("Unknown update code " + updateCode);
                            return;
                        }

                        eventEmitter.emit(mappedEvents[updateCode]);
                    };

                    data.forEach(callEvent);

                    if (data === []) return;

                    console.log(data);
                }).catch(function (error) {
                    return console.log(error);
                });
            };

            var promise = Promise.resolve(true);
            setInterval(function () {
                if (_paused) return;

                promise = promise.then(function () {
                    startRequest();
                });
            }, 500);
        };

        /**
         *
         * @param {number} updateCode
         * @param {string} eventName
         * @private
         */
        var _watch = function _watch(updateCode, eventName) {

            if (Object.keys(mappedEvents).includes(updateCode.toString())) throw new Error("Update-code " + updateCode.toString() + " already has event " + mappedEvents[updateCode.toString()] + " assigned");

            mappedEvents[updateCode] = eventName;

            if (requestStarted) return;

            _checkUpdates();
        };

        /**
         *
         * @param {Object<string, string>} updateCodes
         * @param {EventModule.EventEmitter}eventEmitter
         * @private
         */
        var _init = function _init(updateCodes) {
            var eventEmitter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            eventEmitter = eventEmitter != null ? eventEmitter : new EventModule.EventEmitter();

            _eventEmitter = eventEmitter;

            Object.keys(updateCodes).forEach(function (value) {
                return LongPollDevice.watch(Number(value), updateCodes[value]);
            });

            //  Pause/unpause when window active/not active
            window.addEventListener("blur", _pause);
            window.addEventListener("focus", _unpause);
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

    /**
     *
     * @private
     */
    var _init = function _init() {
        eventEmitter = new EventModule.EventEmitter();

        //  Enable all EventSubscribers.
        Object.keys(eventNames).forEach(function (value) {
            return object[value] = new EventModule.EventSubscriber(eventNames[value], eventEmitter);
        });
        //TODO fetch UserInformation

        var updateCodes = {
            "0": "move-made",
            "1": "game-players-updated",
            "2": "lobby-users-updated",
            "3": "lobby-game-updated"
        };
        _fetchSessionId().then(function (id) {
            return sessionId = id;
        }).then(function () {
            LongPollDevice.init(updateCodes, eventEmitter);
        });

        object.serverEvents = {};
        Object.values(updateCodes).forEach(function (eventName) {
            object.serverEvents[eventName] = new EventModule.EventSubscriber(eventName, eventEmitter);
        });
    };

    var object = {
        API_HOST: API_HOST,
        init: _init,
        login: _login,
        makeMove: _makeMove,

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
"use strict";

var EventModule = function () {
    return {};
}();
"use strict";

var FeedbackWidget = function () {

    var _target = void 0;

    var StorageManager = function () {
        var MESSAGES_STORAGE_KEY = "FeedbackWidget-messages";
        var MAX_MESSAGE_COUNT = 10;

        /**
         *
         * @param {FeedbackWidget.Notification} notification
         */
        var _store = function _store(notification) {
            var storage = window.localStorage;

            var messages_string = storage.getItem(MESSAGES_STORAGE_KEY);
            var messages = messages_string != null ? JSON.parse(messages_string) : [];

            var new_messages = [];
            new_messages.push(notification);

            //  Add maximum of nine messages to the end of the array
            while (messages.length > 0) {
                if (new_messages.length >= MAX_MESSAGE_COUNT) break;

                var value = messages.shift();

                new_messages.push(value);
            }

            storage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(new_messages));
        };

        var _clear = function _clear() {
            var storage = window.localStorage;

            if (storage.getItem(MESSAGES_STORAGE_KEY) == null) return;

            storage.removeItem(MESSAGES_STORAGE_KEY);
        };

        return {
            store: _store,
            clear: _clear
        };
    }();

    var ElementFactory = function () {
        /**
         *
         * @return {HTMLElement}
         * @private
         */
        var _createCloseButton = function _createCloseButton() {
            //  TODO make single class out of this.
            var closeButtonSize = 15;
            var closeButtonSymbol = "&#10761;"; //Cross-symbol

            var closeButton = document.createElement("span");

            closeButton.innerHTML = closeButtonSymbol;
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

            return closeButton;
        };

        /**
         *
         * @param label
         * @return {{clicked: EventModule.EventSubscriber, element: HTMLElement}}
         * @private
         */
        var _createButton = function _createButton(label) {
            var element = document.createElement("button");
            var eventName = "event-click";

            var eventEmitter = new EventModule.EventEmitter();
            var eventSubscriber = new EventModule.EventSubscriber(eventName, eventEmitter);

            element.innerText = label;

            element.addEventListener("click", function () {
                eventEmitter.emit(eventName);
            });

            return {
                clicked: eventSubscriber,
                element: element
            };
        };

        /**
         *
         * @param {FeedbackWidget.Notification} notification
         * @return {HTMLDivElement}
         */
        var _create = function _create(notification) {
            var feedbackWidgetClass = void 0;
            switch (notification.type) {//TODO find a better way of doing this
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

            var element = document.createElement("div");
            element.classList.add("feedback-widget", feedbackWidgetClass);

            var titleElement = document.createElement("span");
            titleElement.classList.add("feedback-widget-title");
            titleElement.innerHTML = notification.title;
            element.appendChild(titleElement);

            var contentElement = document.createElement("span");
            contentElement.classList.add("feedback-widget-content");
            contentElement.innerHTML = notification.content;
            element.appendChild(contentElement);

            var closeButton = _createCloseButton();
            closeButton.addEventListener("click", function () {
                if (notification.close == null) return;

                notification.close();
            }); //close parent
            element.appendChild(closeButton);

            return element;
        };

        return {
            create: _create,
            createButton: _createButton
        };
    }();

    /**
     *
     * @param {string} type
     * @param {string} title
     * @param {string} content
     * @returns {FeedbackWidget.Notification}
     * @private
     */
    var _createNotification = function _createNotification(type, title) {
        var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";


        var notification = new FeedbackWidget.Notification(type, title, content);

        notification.element = ElementFactory.create(notification);

        notification.displayed.subscribe(function () {
            StorageManager.store(notification);
        });

        /**
         *
         * @param label
         * @return {EventModule.EventSubscriber}
         */
        notification.addButton = function (label) {
            var button = ElementFactory.createButton(label);

            notification.element.appendChild(button.element);

            return button.clicked;
        };

        notification.displayTarget = _target;

        return notification;
    };

    /**
     *
     * @param {HTMLElement} target
     * @return {boolean}
     * @private
     */
    var _init = function _init(target) {
        _target = target;

        return true;
    };

    return {
        createNotification: _createNotification,
        init: _init
    };
}();
"use strict";

var Reversi = function () {

    var _gameTarget = void 0;

    /**
     * @type {Reversi.Player}
     */
    var _clientPlayer = void 0;

    var eventEmitter = void 0;

    var eventNames = {
        moveMade: "move-made"
    };

    /**
     *
     * @param {SPA.Data.GameDTO} gameDTO
     * @return {Promise<Reversi.Game>}
     */
    var _loadGameDTO = function _loadGameDTO(gameDTO) {

        var player = _clientPlayer;

        /**@param {Reversi.Game} game**/
        var addEventListeners = function addEventListeners(game) {
            Reversi.events.moveMade.subscribe(game.updateState);

            player.onSelectionChanged.subscribe(game.view.update);

            game.stateUpdated.subscribe(function () {
                Object.values(game.board.cells).forEach(function (cell) {
                    cell.onRightClick = function () {
                        if (!player.ownsPiece(player.selectedPiece)) return;

                        SPA.Data.makeMove(player.selectedPiece.position, cell.coords).then(function () {
                            return eventEmitter.emit(eventNames.moveMade);
                        }).then(Reversi.Feedback.move_success).catch(Reversi.Feedback.move_failure);
                    };
                });

                game.pieces.forEach(function (piece) {
                    return piece.onClick.subscribe(function () {
                        return player.selectPiece(piece);
                    });
                });
            });
            game.stateUpdated.subscribe(game.view.update);

            SPA.Data.serverEvents["move-made"].subscribe(function () {
                return game.updateState();
            });
        };

        var scenario = new Reversi.Scenario(gameDTO.Board.Size);

        var game = Reversi.GameFactory.fromScenario(scenario);

        game.addPlayer(player);

        addEventListeners(game);

        return game.updateState().then(function () {
            return game;
        });
    };

    var _initGameBoard = function _initGameBoard(game) {
        while (_gameTarget.firstChild != null) {
            _gameTarget.removeChild(_gameTarget.firstChild);
        }

        var boardSVG = game.view;

        _gameTarget.appendChild(boardSVG.element);
        boardSVG.render();
    };

    var _reloadLobbies = function _reloadLobbies() {
        var target = document.getElementById("lobby-list");

        SPA.Data.fetchLobbies().then(function (lobbies) {
            return target.innerHTML = SPA_Templates.reversi["lobby-list"]({
                lobbies: lobbies
            });
        });
    };

    var _startNewGame = function _startNewGame(scenarioId) {
        return SPA.Data.openLobby().then(function () {
            return SPA.Data.gameAPI.startNewGame(scenarioId);
        }).then(_initCurrentGame); //TODO catch
    };

    /**
     *
     * @private
     */
    var _initCurrentGame = function _initCurrentGame() {
        SPA.Data.fetchCurrentGame().then(_loadGameDTO).then(_initGameBoard);
    };

    /**
     *
     * @param {HTMLDivElement} target
     * @private
     */
    var _init = function _init(target) {
        Reversi.GameFactory.init();

        eventEmitter = new EventModule.EventEmitter();

        object.events = {
            moveMade: new EventModule.EventSubscriber(eventNames.moveMade, eventEmitter)
        };

        _gameTarget = target;
    };

    /**
     *
     * @param {string} colour
     * @private
     */
    var _setPlayerColour = function _setPlayerColour(colour) {
        if (_clientPlayer == null) {
            _clientPlayer = new Reversi.Player(SPA.currentUser.username, colour);
        }
    };

    var object = {
        init: _init,
        initCurrentGame: _initCurrentGame,
        startNewGame: _startNewGame,
        setPlayerColour: _setPlayerColour,
        reloadLobbies: _reloadLobbies

    };

    return object;
}();
"use strict";

/**
 *
 * @param {string} username
 * @constructor
 */
SPA.User = function (username) {
  this.username = username;
};
"use strict";

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
"use strict";

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
  this.Moves = object.moves;

  /**
   * @type {SPA.Data.PlayerDTO}
   */
  this.CurrentPlayer = object.currentPlayer;
};
"use strict";

/**
 *
 * @param object
 * @constructor
 */
SPA.Data.PlayerDTO = function (object) {
  this.Colour = object.colour;
  this.Score = object.score;
};

/**
 *
 * @return {Reversi.Player}
 */
SPA.Data.PlayerDTO.toPlayer = function () {
  return new Reversi.Player(this.Colour, this.Colour);
};
"use strict";

EventModule.EventEmitter = function () {
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
 * @param {EventModule.EventEmitter} eventEmitter
 * @constructor
 */
EventModule.EventSubscriber = function (eventName, eventEmitter) {
  this.subscribe = function (callback) {
    return eventEmitter.subscribe(eventName, callback);
  };
  this.unsubscribe = function (callback) {
    return eventEmitter.unsubscribe(eventName, callback);
  };
};
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

  return new FeedbackWidget.Coords(x, y);
};
"use strict";

FeedbackWidget.Notification = function (type, title, content) {
    var _this = this;

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

    var eventEmitter = new EventModule.EventEmitter();
    var eventNames = {
        displayed: "event-displayed"
    };

    this.displayed = new EventModule.EventSubscriber(eventNames.displayed, eventEmitter);

    this.title = title;
    this.content = content;

    /**
     * @description closes current element (this.element)
     */
    this.close = function () {
        if (_this.element == null) return;
        if (_this.element.parentNode == null) return;

        _this.element.parentNode.removeChild(_this.element);
        _this.displayData.coords = null;
    };

    /**
     *
     * @param x
     * @param y
     * @return {null}
     */
    this.display = function (x, y) {
        var coords = new FeedbackWidget.Coords(x, y);

        _this.displayData.coords = coords;

        if (_this.element == null) throw new Error("element is null");

        Object.assign(_this.element.style, {
            position: "sticky",
            left: coords.x + "px",
            top: coords.y + "px"
        });

        eventEmitter.emit(eventNames.displayed);

        if (_this.displayTarget == null) throw new Error("displayTarget is null or undefined");

        _this.displayTarget.appendChild(_this.element);

        return _this.element;
    };

    this.isShown = function () {
        return this.displayData.coords != null;
    };

    this.element = null;
    this.displayTarget = null;

    this.displayData = {
        coords: null
    };

    this.addButton = null;
};
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

  this.colour = "#" + colour;

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

    var eventEmitter = new EventModule.EventEmitter();

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
     * @type {EventModule.EventSubscriber}
     */
    this.onClick = new EventModule.EventSubscriber(eventNames.leftClick, eventEmitter);

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

Reversi.Piece.Colours = {
    BLACK: "#000000",
    WHITE: "#FFFFFF"
};
"use strict";

Reversi.Feedback = function () {

    var types = {
        positive: "positive",
        negative: "negative"
    };

    var _moveMade = function _moveMade(success) {
        var message = success ? "Zet gezet!" : "Zet niet gezet: er is iets misgegaan...";
        var type = success ? types.positive : types.negative;

        FeedbackWidget.createNotification(type, message);
    };

    return {
        move_success: function move_success() {
            return _moveMade(true);
        },
        move_failure: function move_failure() {
            return _moveMade(false);
        }
    };
}();
"use strict";

Reversi.GameFactory = function () {

    var _boardFactory = void 0;

    var _cellFactory = void 0;

    /**
     *
     * @param {Reversi.Scenario} scenario
     * @return {Reversi.Game} game
     * @private
     */
    var _fromScenario = function _fromScenario(scenario) {
        return _fromSize(scenario.boardSize);
    };

    /**
     *
     * @param {Reversi.Size} size
     * @return {Reversi.Game} game
     * @private
     */
    var _fromSize = function _fromSize(size) {
        var board = _boardFactory.createBoard(size.x, size.y);

        return new Reversi.Game(board);
    };

    var _init = function _init() {
        _cellFactory = new Reversi.CellFactory();

        _boardFactory = new Reversi.BoardFactory(_cellFactory);

        return true;
    };

    return {
        init: _init,
        fromScenario: _fromScenario,
        fromSize: _fromSize
    };
}();
"use strict";

/**
 *
 * @param {Reversi.Board} board
 * @constructor
 */
Reversi.Game = function (board) {
    var _this = this;

    var eventEmitter = new EventModule.EventEmitter();

    var eventNames = {
        stateUpdated: "state-updated"
    };

    this.stateUpdated = new EventModule.EventSubscriber(eventNames.stateUpdated, eventEmitter);

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

        return SPA.Data.pieceAPI.getPieceCoordinates().then(createPieces).then(_this.setPieces).then(function () {
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
     * @param {Array<Reversi.Piece>} pieces
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

    var eventEmitter = new EventModule.EventEmitter();

    var eventNames = {
        selectionChanged: "selection-changed"
    };

    this.username = username;
    this.pieces = [];

    var _colour = colour;

    this.colour = function () {
        return _colour;
    };

    this.onSelectionChanged = new EventModule.EventSubscriber(eventNames.selectionChanged, eventEmitter);

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

        var strip_colour_hex = function strip_colour_hex(inputString) {
            return inputString.replace("#", "");
        };

        return strip_colour_hex(_this.colour()) === strip_colour_hex(piece.colour);
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

  var eventEmitter = new EventModule.EventEmitter();

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
   * @type {EventModule.EventSubscriber}
   */
  this.updateInvoked = new EventModule.EventSubscriber(eventNames.update, eventEmitter);

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

        var piece_css_class = void 0;

        switch (piece.colour) {
            case Reversi.Piece.Colours.BLACK:
                piece_css_class = "reversi-piece-black";
                break;
            case Reversi.Piece.Colours.WHITE:
                piece_css_class = "reversi-piece-white";
                break;
            default:
                throw new Error("Unknown colour " + piece.colour);
        }

        element.addEventListener("click", function (event) {
            event.preventDefault();

            piece.click();
        });

        element.classList.add("reversi-piece");

        if (piece.isSelected) {
            element_attributes["stroke-width"] = ".5";
            element_attributes["stroke"] = "white";
        }

        Reversi.BoardElementFactory.SVGUtil.setAttributesNS(element, element_attributes);
        return element;
    };

    /**
     *
     * @param {Reversi.Cell} cell
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

        cellElement.classList.add("reversi-board-cell");

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