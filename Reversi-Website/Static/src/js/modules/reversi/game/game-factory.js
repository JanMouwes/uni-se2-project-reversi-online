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
        return _fromSize(scenario.boardSize);
    };

    /**
     *
     * @param {Reversi.Size} size
     * @return {Reversi.Game} game
     * @private
     */
    let _fromSize = (size) => {
        let board = _boardFactory.createBoard(size.x, size.y);

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
        fromSize: _fromSize
    }
})();