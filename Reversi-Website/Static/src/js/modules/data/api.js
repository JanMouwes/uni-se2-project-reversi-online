SPA.Data = (() => {
    const constructURIString = (object) => {
        let outputArray = [];

        Object.keys(object).map(key => {
            key = encodeURIComponent(key);
            let value = encodeURIComponent(object[key]);
            outputArray.push(key + "=" + value);
        });

        return outputArray.join("&");
    };

    const API_HOST = "http://localhost:5000";

    let eventEmitter;

    let eventNames = {
        lobbyOpened: "lobby-opened",
        lobbyJoined: "lobby-joined",
    };

    let sessionId;

    let _startNewGame = (scenarioId) => {
        let body = encodeURIComponent(scenarioId);

        return window.fetch(API_HOST + "/api/game",
            {
                method: "POST",
                mode: "cors",
                body: body,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "session-id": sessionId
                }
            })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(data => Reversi.setPlayerColour(data.colour));
    };

    /**
     *
     * @return {Promise<SPA.Data.GameDTO>}
     * @private
     */
    let _fetchCurrentGame = () => {
        return window.fetch(API_HOST + "/api/game",
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "session-id": sessionId
                }
            })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(object => new SPA.Data.GameDTO(object));
    };

    let _openLobby = () => {
        return window.fetch(API_HOST + "/api/lobbies",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "session-id": sessionId
                }
            }).then(response => {
            if (!response.ok) return Promise.reject();

            eventEmitter.emit(eventNames.lobbyOpened);
            return Promise.resolve(response);
        });
    };

    let _joinLobby = (lobbyId) => {
        return window.fetch(API_HOST + "/api/lobbies/" + lobbyId,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "session-id": sessionId
                }
            })
            .then(response => !response.ok ? Promise.reject() : response.json()
            ).then(data => {
                Reversi.setPlayerColour(data.colour);

                eventEmitter.emit(eventNames.lobbyJoined);
                return data;
            });
    };

    let _fetchSessionId = () => {
        return window.fetch(
            API_HOST + "/api/session",
            {
                method: "GET",
                mode: "cors"
            })
            .then(response => response.json())
            .then(json => Promise.resolve(json.sessionId));
    };

    /**
     *
     * @param {{Username: string, PasswordHash: string}}loginObject
     * @return {Promise<Response | never>}
     * @private
     */
    let _login = (loginObject) => {
        let body = constructURIString(loginObject);
        return window.fetch(
            API_HOST + "/api/login",
            {
                method: "POST",
                body: body,
                headers: {
                    "session-id": sessionId
                },
                mode: "cors"
            })
            .then(response => {
                if (!response.ok) return Promise.reject;

                SPA.currentUser = new SPA.User(loginObject.Username);
                return response.text();
            })
    };

    /**
     *
     * @return {Promise<Response>}
     * @private
     */
    let _fetchBoardState = () => {
        let headers = new Headers({
            "session-id": sessionId
        });
        return window.fetch(API_HOST + "/api/board",
            {
                method: "GET",
                mode: "cors",
                headers: headers,
            })
    };

    /**
     *
     * @return {Promise<Array<string, Array<Reversi.Coords>>>}
     * @private
     */
    let _getPieceCoordinates = () => {
        return _fetchBoardState()
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(function (object) {

                let boardData = object;

                let colourPieces = [];

                boardData.pieces.forEach(piece => {
                    if (!Object.keys(colourPieces).includes(piece.colour)) colourPieces[piece.colour] = [];

                    colourPieces[piece.colour].push(new Reversi.Coords(piece.position.x, piece.position.y));
                });

                return Promise.resolve(colourPieces);
            });
    };

    /**
     *
     * @param {Reversi.Coords} from
     * @param {Reversi.Coords} to
     * @return {Promise} request
     * @private
     */
    let _makeMove = (from, to) => {


        let body = {
            FromX: Number(from.x),
            FromY: Number(from.y),

            ToX: Number(to.x),
            ToY: Number(to.y)
        };

        let headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "session-id": sessionId
        });

        return window.fetch(
            API_HOST + "/api/move",
            {
                method: "POST",
                mode: "cors",
                body: constructURIString(body),
                headers: headers,
            }
        ).then(response => {
            if (response.ok) return Promise.resolve();

            return Promise.reject();
        });
    };

    /**
     *
     * @return {Promise<Response>}
     * @private
     */
    let _fetchScenarioIds = () => {
        return window.fetch(
            API_HOST + "/api/scenario",
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            }).then(response => {

            let reader = response.body.getReader();

            return reader.read().then((object) => {
                let scenarios = object;

                if (scenarios == null) return Promise.reject();

                return Promise.resolve(scenarios);
            });
        });
    };

    let _fetchLobby = (id) => {
        return window.fetch(
            API_HOST + "/api/lobbies/" + id,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            }).then(response => {

            let reader = response.body.getReader();

            return reader.read().then((object) => {
                let scenarios = object;

                if (scenarios == null) return Promise.reject();

                return Promise.resolve(scenarios);
            });
        });
    };

    /**
     *
     * @return {Promise<any>}
     * @private
     */
    let _fetchLobbies = () => {
        return window.fetch(
            API_HOST + "/api/lobbies",
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })
            .then(response => response.json());
    };

    const LongPollDevice = (() => {
        /**
         * @type EventModule.EventEmitter
         */
        let _eventEmitter;

        let mappedEvents = [];

        let requestStarted = false;

        const url = API_HOST + "/api/session/updates";

        let _updateCodes;

        let _paused = false;

        let _pause = function () {
            _paused = true;
        };

        let _unpause = function () {
            _paused = false;
        };


        /**
         *
         * @param url
         * @return {Promise<Response>}
         * @private
         */
        let _sendRequest = (url) => {
            return window.fetch(url, {
                headers: {
                    "Connection": "Keep-Alive",
                    "session-id": sessionId
                }
            })
        };

        let _checkUpdates = function () {
            requestStarted = true;

            let startRequest = function () {
                return _sendRequest(url)
                    .then(request => request.ok ? request.json() : Promise.reject())
                    .then(function (data) {
                        if (!(data instanceof Array)) return Promise.reject("Invalid data type: " + typeof(data));

                        let callEvent = function (updateCode) {
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
                    })
                    .catch(error => console.log(error));
            };

            let promise = Promise.resolve(true);
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
        let _watch = (updateCode, eventName) => {

            if (Object.keys(mappedEvents).includes(updateCode.toString()))
                throw new Error("Update-code " + updateCode.toString() + " already has event " + mappedEvents[updateCode.toString()] + " assigned");

            mappedEvents[updateCode] = eventName;

            if (requestStarted) return;

            _checkUpdates();
        };

        let _startPolling = function () {
            Object.keys(_updateCodes).forEach(value => LongPollDevice.watch(Number(value), _updateCodes[value]));
        };

        /**
         *
         * @param {Object<string, string>} updateCodes
         * @param {EventModule.EventEmitter}eventEmitter
         * @private
         */
        let _init = (updateCodes, eventEmitter = null) => {
            eventEmitter = eventEmitter != null ? eventEmitter : new EventModule.EventEmitter();

            _eventEmitter = eventEmitter;

            _updateCodes = updateCodes;

            //  Pause/unpause when window active/not active
            window.addEventListener("blur", _pause);
            window.addEventListener("focus", _unpause);
        };

        return {
            init: _init,
            startPolling: _startPolling,
            watch: _watch,
            subscribe: (eventName, callback) => eventEmitter.subscribe(eventName, callback),
            unsubscribe: (eventName, callback) => eventEmitter.unsubscribe(eventName, callback)
        }

    })();


    /**
     *
     * @private
     */
    let _init = () => {
        eventEmitter = new EventModule.EventEmitter();

        //  Enable all EventSubscribers.
        Object.keys(eventNames).forEach(value => object[value] = new EventModule.EventSubscriber(eventNames[value], eventEmitter));
        //TODO fetch UserInformation

        const updateCodes = {
            "0": "move-made",
            "1": "game-players-updated",
            "2": "lobby-users-updated",
            "3": "lobby-game-updated"
        };

        return _fetchSessionId()
            .then(id => sessionId = id)
            .then(function () {
                LongPollDevice.init(updateCodes, eventEmitter);
            })
            .then(function () {
                object.serverEvents = {};
                Object.values(updateCodes).forEach(function (eventName) {
                    object.serverEvents[eventName] = new EventModule.EventSubscriber(eventName, eventEmitter);
                });
            });

    };

    let object = {
        API_HOST: API_HOST,
        init: _init,
        login: _login,
        makeMove: _makeMove,

        fetchScenarioIds: _fetchScenarioIds,

        fetchLobby: _fetchLobby,
        fetchLobbies: _fetchLobbies,
        openLobby: _openLobby,

        joinLobby: _joinLobby,
        startPolling: function () {
            LongPollDevice.startPolling();
        },

        pieceAPI: {
            getPieceCoordinates: _getPieceCoordinates
        },

        fetchCurrentGame: _fetchCurrentGame,
        gameAPI: {
            startNewGame: _startNewGame

        }
    };

    return object;
})
();