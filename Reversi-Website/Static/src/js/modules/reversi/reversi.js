const Reversi = (() => {

    let _gameTarget;

    let _clientPlayer;

    let _initPlayer = (player) => {
        _clientPlayer = player;
    };

    let loadScenario = (scenario) => {

        let player = _clientPlayer;

        /**@param {Reversi.Game} game**/
        let addEventListeners = game => {
            SPA.Data.moveMade.subscribe(game.updateState);

            player.onSelectionChanged.subscribe(game.view.update);

            game.stateUpdated.subscribe(() => {
                Object.values(game.board.cells).forEach(cell => {
                    cell.onRightClick = () => {
                        if (!player.ownsPiece(player.selectedPiece)) return;

                        SPA.Data.makeMove(player.selectedPiece.position, cell.coords);
                    }
                });

                game.pieces.forEach(piece => piece.onClick.subscribe(() => player.selectPiece(piece)));
            });
            game.stateUpdated.subscribe(game.view.update);
        };

        let game = Reversi.GameFactory.fromScenario(scenario);

        game.addPlayer(player);

        addEventListeners(game);

        return game.updateState()
            .then(() => game);
    };

    /**
     *
     * @param {Event} event
     * @private
     */
    let _onSelectScenario = (event) => {
        event.preventDefault();


        /**
         *
         * @type {number}
         */
        let scenarioId = Number(document.getElementById("scenario-selector").value);

        return SPA.Data.openLobby()
            .then(() => SPA.Data.gameAPI.startNewGame(scenarioId))
            .then(SPA.Data.fetchScenario)
            .then(loadScenario)
            .then(_initGameBoard); //TODO catch
    };

    let _initGameBoard = (game) => {
        // Reversi.LongPollDevice.watch("api/game/update", "gameUpdate");
        // Reversi.LongPollDevice.subscribe("gameUpdate");

        while (_gameTarget.firstChild != null) {
            _gameTarget.removeChild(_gameTarget.firstChild);
        }

        let boardSVG = game.view;

        _gameTarget.appendChild(boardSVG.element);
        boardSVG.render();
    };

    let loadLobbies = () => {
        const target = document.getElementById("lobby-list");

        let createLobbyListItem = lobby => {
            let element = document.createElement("li");

            element.innerText = "Id: " + lobby.id;

            return element;
        };

        let loadLobby = lobby => {
            let element = createLobbyListItem(lobby);

            element.onclick = () => SPA.Data.joinLobby(lobby.id);

            target.appendChild(element);
        };

        SPA.Data.fetchLobbies().then(lobbies => lobbies.forEach(loadLobby))
    };

    /**
     *
     * @param {HTMLDivElement} target
     * @private
     */
    let _init = (target) => {
        Reversi.GameFactory.init();

        _gameTarget = target;

        let name = prompt("What is your name?"); //FIXME temp

        let colour;
        do {
            colour = prompt("What colour do you want to be? Hex pls", "FFFFFF");
        } while (!colour.match(/^[0-9A-F]{6}$/));

        let player = new Reversi.Player(name, "#".concat(colour));

        _initPlayer(player);

        /**
         *
         * @type {HTMLFormElement}
         */
        let scenarioForm = document.getElementById("scenario-form");

        scenarioForm.addEventListener("submit", _onSelectScenario);

        loadLobbies();

        SPA.Data.lobbyJoined.subscribe(() => {
            SPA.Data.fetchCurrentGame().then(game => {
                let size = Reversi.Size.parse(game.boardInfo.size);

                return new Reversi.Scenario(size);
            })
                .then(loadScenario)
                .then(_initGameBoard);
        })
    };

    return {
        init: _init
    }
})();