SPA.Templating = (function () {
    let _templates;


    let _getTemplate = function (template_name) {
        return _templates[template_name];
    };

    let _init = function (templates) {
        _templates = templates;
    };


    /**
     * @param {{id: string}[]}lobbies
     * @return {string}
     * @private
     */
    let _lobbyList = (lobbies) => SPA_Templates.reversi["lobby-list"]({lobbies: lobbies});

    let _loginScreen = (hasMessage = false, message = "") => SPA_Templates.login.login({
        messageModel: {
            hasMessage: hasMessage,
            message: message
        }
    });

    let _chartWrapper = (title, id) => SPA_Templates.charts.chart({
        "title": title,
        "chart-id": id
    });

    /**
     * @param {{id: string}[]}lobbies
     * @return {string}
     * @private
     */
    let _gameScreen = (lobbies) => SPA_Templates.reversi["game-screen"]({
        lobbyList: _lobbyList(lobbies)
    });

    return {
        init: _init,
        getTemplate: _getTemplate,
        lobbyList: _lobbyList,
        loginScreen: _loginScreen,
        chartWrapper: _chartWrapper,
        gameScreen: _gameScreen
    };
})();