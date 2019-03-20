/**
 * Q: 'But Jan, why would you have both a Size- ánd a Coords-class?'
 * A: Surface-area-calculations.
 * @param {number} x
 * @param {number} y
 * @constructor
 */
Reversi.Size = function (x, y) {
    
    
    this.x = x;
    this.y = y;

    this.getArea = () => {
        return this.x * this.y;
    }
};

/**
 *
 * @description parses string 'x,y', returns Size
 * @param {string} data
 * @return {Reversi.Size}
 */
Reversi.Size.parse = (data) => {
    let array = data.split(",");

    let xSize = Number(array[0].replace(new RegExp("[^0-9]"), ""));
    let ySize = Number(array[1].replace(new RegExp("[^0-9]"), ""));

    return new Reversi.Size(xSize, ySize);
};