Reversi.GameFactory = (function () {

    let _boardFactory;

    let _cellFactory;

    /**
     *
     * @param {Reversi.Scenario} scenario
     * @return {Reversi.Game} game
     * @private
     */
    let _fromScenario = (scenario) => {
        let board = _boardFactory.createBoard(scenario.boardSize.x, scenario.boardSize.y);

        return new Reversi.Game(board);
    };


    let _init = function () {
        _cellFactory = new Reversi.CellFactory();

        _boardFactory = new Reversi.BoardFactory(_cellFactory);

        return true;
    };

    return {
        init: _init,
        fromScenario: _fromScenario,
    }
})();