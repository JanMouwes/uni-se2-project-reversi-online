/**
 *
 * @param {number} x
 * @param {number} y
 * @constructor
 */
Reversi.Coords = function (x, y) {
    /**
     *
     * @type {number}
     */
    this.x = x;

    /**
     *
     * @type {number}
     */
    this.y = y;

    /**
     * @description returns 'x, y'
     * @return {string}
     */
    this.toString = () => {
        return x + ", " + y
    };

    /**
     *
     * @param {Reversi.Coords} otherCoords
     */
    this.equals = function (otherCoords) {
        return this.x === otherCoords.x && this.y === otherCoords.y
    }
};
/**
 *
 * @param {string} input
 * @returns {Coords}
 */
Reversi.Coords.parse = (input) => {

    let input_split = input.split(",");

    let isCorrectLength = input_split.length === 2;

    let isCorrectType = true;

    input_split.map(item => {
        item = item.trim();

        if (isNaN(Number(item)))
            isCorrectType = false;
    });


    if (!isCorrectLength || !isCorrectType)
        throw new Error("Incorrect input: " + input);

    let x = Number(input_split[0]);
    let y = Number(input_split[1]);

    return new Reversi.Coords(x, y);
};