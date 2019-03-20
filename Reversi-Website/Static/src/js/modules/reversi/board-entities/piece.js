/**
 *
 * @param {string} colour
 * @constructor
 */
Reversi.Piece = function (colour) {

    let eventEmitter = new EventModule.EventEmitter();

    let eventNames = {
        leftClick: "click-left"
    };

    /**
     *
     * @type {string}
     */
    this.colour = colour;

    /**
     *
     * @type {Coords}
     */
    this.position = null;

    /**
     *
     * @type {EventModule.EventSubscriber}
     */
    this.onClick = new EventModule.EventSubscriber(eventNames.leftClick, eventEmitter);

    this.click = function () {
        eventEmitter.emit(eventNames.leftClick)
    };

    /**
     *
     * @type {boolean}
     */
    this.isSelected = false;

    this.select = () => {
        this.isSelected = true;
    };

    this.deselect = () => {
        this.isSelected = false;
    };

    this.toggleSelect = () => {
        this.isSelected = !this.isSelected;
    }
};