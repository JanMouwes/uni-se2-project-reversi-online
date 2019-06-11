let SPA = (function () {

    let eventEmitter;

    let eventNames = {
        loggedIn: "logged-in"
    };

    let _login = function (loginObject) {
        return SPA.Data.login(loginObject)
                  .then(() => eventEmitter.emit(eventNames.loggedIn))
                  .catch(SPA.Feedback.login_failure);
    };

    /**
     * @private
     */
    let _onStartNewGame = () => {
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

        SPA.Data.init().then(SPA.Data.startPolling);

        return true;
    };

    let _loadLogin = function () {
        let target = document.getElementById("content");

        target.innerHTML = SPA.Templating.loginScreen();

        target.innerHTML += SPA.Templating.chartWrapper("Near asteroid fly-bys in the past week, by day", "asteroid");

        object.events.login.subscribe(function () {

            // Load new screen
            target.innerHTML = SPA.Templating.gameScreen([]);

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
                FeedbackWidget.createNotification("positive", "move made").display();
            });
        });
        object.events.login.subscribe(SPA.Feedback.login_success);
    };

    let _loadAsteroidChart = function () {
        const daysBack = 7;

        let promises = [];
        let data = [];
        for (let i = daysBack; i > 0; i--) {
            let day = new Date(Date.now());
            day.setDate(day.getDate() - i);

            promises.push(SPA.Data.NASA.fetchCount.byDay(day)
                             .then(count => data[day.getTime()] = count));
        }

        Promise.all(promises).then(function () {
            let chartCanvas = document.getElementById("asteroid-chart");

            let sorted_keys = Object.keys(data).sort((a, b) => Number(a) - Number(b));
            let sorted_data = {};

            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            sorted_keys.forEach(key => {
                let date = new Date();

                date.setTime(Number(key));

                let day_long = days[date.getDay()];

                sorted_data[day_long] = data[key];
            });

            let chart = SPA.Chart.createAsteroidChart(chartCanvas.getContext("2d"), sorted_data);
        });
    };

    let object = {
        currentUser: null,
        init: _init,
        loadLogin: _loadLogin,
        loadAsteroidChart: _loadAsteroidChart,
        startNewGame: _onStartNewGame,
        login: _login,
        events: {
            /**
             * @type {EventModule.EventSubscriber}
             */
            login: null
        }
    };

    return object;
})();