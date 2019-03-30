let SPA = (function () {

    let eventEmitter;

    let eventNames = {
        loggedIn: "logged-in"
    };

    let _login = function (loginObject) {
        SPA.Data.login(loginObject).then(() => eventEmitter.emit(eventNames.loggedIn))
    };

    /**
     *
     * @param {Event} event
     * @private
     */
    let _onStartNewGame = (event) => {
        event.preventDefault();

        /**
         *
         * @type {number}
         */
            // let scenarioId = Number(document.getElementById("scenario-selector").value);
        let scenarioId = 0;

        return Reversi.startNewGame(scenarioId);
    };


    let _init = function () {
        eventEmitter = new EventModule.EventEmitter();

        object.events.login = new EventModule.EventSubscriber(eventNames.loggedIn, eventEmitter);

        SPA.Data.init();

        let target = document.getElementById("content");

        target.innerHTML = SPA_Templates.login.login({
            messageModel: {
                hasMessage: false,
                message: ""
            }
        });

        object.events.login.subscribe(function () {

            // Load new screen
            let lobbyList = SPA_Templates.reversi["lobby-list"]({
                lobbies: []
            });
            let gameBoard = SPA_Templates.reversi["game-board"]({});

            target.innerHTML = SPA_Templates.reversi["game-screen"]({
                lobbyList: lobbyList,
                gameBoard: gameBoard
            });

            let target_gameBoard = document.getElementById("game-board");

            //  Init reversi
            Reversi.init(target_gameBoard);

            /**
             *
             * @type {HTMLFormElement}
             */
            let newGameButton = document.getElementById("new-game-button");

            newGameButton.addEventListener("click", _onStartNewGame);

            Reversi.reloadLobbies();

            SPA.Data.lobbyJoined.subscribe(Reversi.initCurrentGame);

            SPA.Data.serverEvents["move-made"].subscribe(function () {
                FeedbackWidget.createNotification("positive", "move made").display()
            });
        });

        return true;
    };
    let object = {
        currentUser: null,
        init: _init,
        login: _login,
        events: {
            login: null
        }
    };

    return object;
})();