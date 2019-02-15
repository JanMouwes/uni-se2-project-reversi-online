// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

/**
 *
 * @type {HTMLFormElement}
 */
let scenarioForm = document.getElementById("scenario-form");

/**
 *
 * @type {HTMLSelectElement}
 */
let scenarioSelector = document.getElementById("scenario-selector");

scenarioForm.onsubmit = (event) => {
    event.preventDefault();


    let scenarioId = Number(scenarioSelector.value);

    ReversiAPI.getScenario(scenarioId).then(ReversiAPI.gameAPI.startNewGame).then((scenario) => {

        let clientPlayer = new Player("Jan", "blue");

        let game = GameLoader.loadScenario(scenario, clientPlayer);

        let boardWrapper = document.getElementById("main-board");

        while (boardWrapper.firstChild != null) {
            boardWrapper.removeChild(boardWrapper.firstChild);
        }

        let size = Math.min(600, window.innerWidth);

        game.board.setDimensions(size, size);

        boardWrapper.appendChild(game.board.element);
    });

};
