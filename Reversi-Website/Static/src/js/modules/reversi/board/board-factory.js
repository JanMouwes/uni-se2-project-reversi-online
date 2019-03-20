/**
 *
 * @param {Reversi.CellFactory} cellFactory
 * @constructor
 */
Reversi.BoardFactory = function (cellFactory) {

    /**
     *
     * @param {number} width: the width in cells
     * @param {number} height: the height in cells
     * @returns {Board}
     */
    this.createBoard = (width, height) => {
        let rows = [];
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            let cells = [];
            for (let columnIndex = 0; columnIndex < width; columnIndex++) {
                let coords = new Reversi.Coords(rowIndex, columnIndex);

                cells[columnIndex] = cellFactory.createCell(coords);
            }
            rows[rowIndex] = cells;
        }

        let cells = [];
        rows.forEach(row => row.forEach(cell => cells[cell.coords.toString()] = cell));

        return new Reversi.Board(new Reversi.Size(width, height), cells);
    };
};