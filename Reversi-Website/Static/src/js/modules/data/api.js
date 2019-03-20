/**
 *
 * @type {{makeMove, getScenario, pieceAPI, gameAPI}}
 */
SPA.Data = (() => {

    const API_HOST = "http://localhost:5000";

    let eventEmitter;

    let eventNames = {
        moveMade: "move-made",
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
            }).then(response => response.ok ? scenarioId : Promise.reject());
    };

    let _fetchCurrentGame = () => {
        return window.fetch(API_HOST + "/api/game",
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "session-id": sessionId
                }
            }).then(response => response.ok ? response.json() : Promise.reject());
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
            }).then(response => {
            if (!response.ok) return Promise.reject();

            eventEmitter.emit(eventNames.lobbyJoined);
            return Promise.resolve(response);
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
     * @return {Promise<Response>}
     * @private
     */
    let _fetchBoardState = () => {
        let headers = new Headers({
            "session-id": sessionId
        });
        //TODO preprocess to NEW BoardState-model
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
        let parseResponse = response => {
            let reader = response.body.getReader();

            return reader.read().then((object) => {

                let boardData = JSON.parse(new TextDecoder("utf-8").decode(object.value));

                let colourPieces = [];

                boardData.pieces.forEach(piece => {
                    if (!Object.keys(colourPieces).includes(piece.colour)) colourPieces[piece.colour] = [];

                    colourPieces[piece.colour].push(new Reversi.Coords(piece.position.x, piece.position.y));
                });

                return Promise.resolve(colourPieces);
            });
        };


        return _fetchBoardState()
            .then(parseResponse);

    };

    /**
     *
     * @param {Reversi.Coords} from
     * @param {Reversi.Coords} to
     * @return {Promise} request
     * @private
     */
    let _makeMove = (from, to) => {

        let constructURIString = (object) => {
            let outputArray = [];

            Object.keys(object).map(key => {
                key = encodeURIComponent(key);
                let value = encodeURIComponent(object[key]);
                outputArray.push(key + "=" + value);
            });

            return outputArray.join("&");
        };

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
        }).then(() => eventEmitter.emit(eventNames.moveMade));
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

        /**
         *
         * @param {ReadableStreamReadResult} object
         * @returns {Reversi.Scenario}
         */
        let processStreamToScenario = (object) => {
            let scenarioData = JSON.parse(new TextDecoder("utf-8").decode(object.value));

            let boardSize = Reversi.Size.parse(scenarioData.boardSize);

            let scenario = new Reversi.Scenario(boardSize);

            Object.keys(scenarioData.startingPositions).map(coordsString => {

                let colour = scenarioData.startingPositions[coordsString];

                colour = colour.split()[0] === "#" ? colour : "#".concat(colour);

                coordsString = coordsString
                    .replace("(", "")
                    .replace(")", "");

                let coords = Reversi.Coords.parse(coordsString);

                scenario.addPiece(colour, coords);
            });

            return scenario;
        };
        //TODO type checking, rejecting, etc.

        return window.fetch(
            API_HOST + "/api/scenario/" + scenarioId,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            }).then(response => {

            let reader = response.body.getReader();

            return reader.read().then((object) => {
                let scenario = processStreamToScenario(object);

                if (scenario == null) return Promise.reject();

                return Promise.resolve(scenario);
            });
        })
    };

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


    /**
     *
     * @private
     */
    let _init = () => {
        eventEmitter = new EventModule.EventEmitter();

        object.moveMade = new EventModule.EventSubscriber(eventNames.moveMade, eventEmitter);
        object.lobbyOpened = new EventModule.EventSubscriber(eventNames.lobbyOpened, eventEmitter);
        object.lobbyJoined = new EventModule.EventSubscriber(eventNames.lobbyJoined, eventEmitter);

        //TODO fetch UserInformation

        _fetchSessionId().then(id => sessionId = id);
    };

    let object = {
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

})();