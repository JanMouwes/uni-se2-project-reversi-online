/**
 *
 * @param object
 * @constructor
 */
SPA.Data.PlayerDTO = function (object) {
    this.Colour = object.colour;
    this.Score = object.score;
};

/**
 *
 * @return {Reversi.Player}
 */
SPA.Data.PlayerDTO.toPlayer = function () {
    return new Reversi.Player(this.Colour, this.Colour)
};