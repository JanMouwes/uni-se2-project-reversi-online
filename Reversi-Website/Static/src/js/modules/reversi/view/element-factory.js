/**
 *
 */
Reversi.BoardElementFactory = function () {
    let CELL_SIZE = 10;
    let PIECE_PERCENT_OF_CELL = .8;
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    /**
     *
     * @param {Reversi.Piece} piece
     * @returns {SVGCircleElement}
     */
    this.createPieceElement = (piece) => {
        /**
         *
         * @type {SVGCircleElement}
         */
        let element = document.createElementNS(SVG_NAMESPACE, "circle");

        let adjustedCoords = new Reversi.Coords(piece.position.x + .5, piece.position.y + .5);

        let element_attributes = {
            r: CELL_SIZE * PIECE_PERCENT_OF_CELL / 2,
            style: "fill:" + piece.colour,
            cx: adjustedCoords.x * CELL_SIZE,
            cy: adjustedCoords.y * CELL_SIZE
            //NICER 'recalculate' these Coords through a Coords/CellCalculator of sorts.
        };

        let piece_css_class;

        switch (piece.colour) {
            case Reversi.Piece.Colours.BLACK:
                piece_css_class = "reversi-piece-black";
                break;
            case Reversi.Piece.Colours.WHITE:
                piece_css_class = "reversi-piece-white";
                break;
            default:
                throw new Error("Unknown colour " + piece.colour);
        }
        element.classList.add(piece_css_class);

        if (piece.isSelected) {
            element.classList.add("reversi-piece-selected");
        }

        element.addEventListener("click", (event) => {
            event.preventDefault();

            piece.click();
        });


        Reversi.BoardElementFactory.SVGUtil.setAttributesNS(element, element_attributes);
        return element;
    };

    /**
     *
     * @param {Reversi.Cell} cell
     * @returns {SVGRectElement}
     */
    this.createCellElement = (cell) => {
        let cellElement = document.createElementNS(SVG_NAMESPACE, "rect");

        let cell_attributes = {
            x: cell.coords.x * CELL_SIZE,
            y: cell.coords.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            style: "fill:" + cell.colour
        };


        Reversi.BoardElementFactory.SVGUtil.setAttributesNS(cellElement, cell_attributes);

        cellElement.addEventListener("click", (event) => {
            event.preventDefault();

            if (cell.onClick == null) return;

            cell.onClick();
        });

        cellElement.classList.add("reversi-board-cell");

        cellElement.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            if (cell.onRightClick == null) return;

            cell.onRightClick();
        });

        return cellElement;
    };

    /**
     *
     * @param {number} width
     * @param {number} height
     * @param {Array<Cell>} cells
     * @returns {SVGElement}
     */
    this.createBoardElement = (width, height, cells) => {
        let boardElement = document.createElementNS(SVG_NAMESPACE, "svg");

        cells.map((cell) => {
            let element = this.createCellElement(cell);

            boardElement.appendChild(element);
        });

        let realWidth = width * CELL_SIZE;
        let realHeight = height * CELL_SIZE;

        Reversi.BoardElementFactory.SVGUtil.setAttributesNS(boardElement, {
            viewBox: "0 0 " + realWidth + " " + realHeight
        });

        return boardElement;
    };
};