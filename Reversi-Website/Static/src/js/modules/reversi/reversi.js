const Reversi = (() => {

    let _gameTarget;

    /**
     * @type {Reversi.Player}
     */
    let _clientPlayer;

    let eventEmitter;

    const eventNames = {
        moveMade: "move-made"
    };

    /**
     *
     * @param {SPA.Data.GameDTO} gameDTO
     * @return {Promise<Reversi.Game>}
     */
    let _loadGameDTO = (gameDTO) => {

        let player = _clientPlayer;

        /**@param {Reversi.Game} game**/
        let addEventListeners = game => {
            Reversi.events.moveMade.subscribe(game.updateState);

            player.onSelectionChanged.subscribe(game.view.update);

            game.stateUpdated.subscribe(() => {
                Object.values(game.board.cells).forEach(cell => {
                    cell.onRightClick = () => {
                        if (!player.ownsPiece(player.selectedPiece)) return;

                        SPA.Data.makeMove(player.selectedPiece.position, cell.coords)
                            .then(() => eventEmitter.emit(eventNames.moveMade))
                            .then(Reversi.Feedback.move_success)
                            .catch(Reversi.Feedback.move_failure);
                    }
                });

                game.pieces.forEach(piece => piece.onClick.subscribe(() => player.selectPiece(piece)));
            });
            game.stateUpdated.subscribe(game.view.update);

            SPA.Data.serverEvents["move-made"]
                .subscribe(() => game.updateState());
        };

        let scenario = new Reversi.Scenario(gameDTO.Board.Size);

        let game = Reversi.GameFactory.fromScenario(scenario);

        game.addPlayer(player);

        addEventListeners(game);

        return game.updateState().then(() => game);
    };

    let _initGameBoard = (game) => {
        while (_gameTarget.firstChild != null) {
            _gameTarget.removeChild(_gameTarget.firstChild);
        }

        let boardSVG = game.view;

        _gameTarget.appendChild(boardSVG.element);
        boardSVG.render();
    };

    let _reloadLobbies = function () {
        const target = document.getElementById("lobby-list");

        SPA.Data.fetchLobbies().then(lobbies => target.innerHTML = SPA_Templates.reversi["lobby-list"]({
            lobbies: lobbies
        }));
    };

    let _startNewGame = function (scenarioId) {
        return SPA.Data.openLobby()
            .then(() => SPA.Data.gameAPI.startNewGame(scenarioId))
            .then(_initCurrentGame); //TODO catch
    };

    /**
     *
     * @private
     */
    let _initCurrentGame = function () {
        SPA.Data.fetchCurrentGame()
            .then(_loadGameDTO)
            .then(_initGameBoard);
    };

    /**
     *
     * @param {HTMLDivElement} target
     * @private
     */
    let _init = (target) => {
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
    let _setPlayerColour = function (colour) {
        if (_clientPlayer == null) {
            _clientPlayer = new Reversi.Player(SPA.currentUser.username, colour);
        }
    };

    let object = {
        init: _init,
        initCurrentGame: _initCurrentGame,
        startNewGame: _startNewGame,
        setPlayerColour: _setPlayerColour,
        reloadLobbies: _reloadLobbies,

    };

    return object;
})();