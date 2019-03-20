/**
 *
 * @constructor
 */
Reversi.CellFactory = function () {

    /**
     *
     * @param {Reversi.Coords} coords
     * @returns {Reversi.Cell}
     */
    this.createCell = (coords) => {
        let colour = (coords.x + coords.y) % 2 === 1 ? "red" : "brown"; //TODO make cell colours dynamic

        return new Reversi.Cell(coords, colour);
    };

};