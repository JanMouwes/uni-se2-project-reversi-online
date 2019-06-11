FeedbackWidget.Notification = function (type, title, content) {

    switch (type) { //TODO find a better way of doing this
        case "positive":
        case "negative":
            this.type = type;
            break;
        default:
        case "neutral":
            this.type = "neutral";
            break;
    }

    let eventEmitter = new EventModule.EventEmitter();
    let eventNames = {
        displayed: "event-displayed"
    };

    this.displayed = new EventModule.EventSubscriber(eventNames.displayed, eventEmitter);

    this.title = title;
    this.content = content;

    /**
     * @description closes current element (this.element)
     */
    this.close = () => {
        if (this.element == null) return;
        if (this.element.parentNode == null) return;

        this.element.parentNode.removeChild(this.element);
        this.displayData.coords = null;
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    this.display = (x, y) => {
        let coords = new FeedbackWidget.Coords(x, y);

        this.displayData.coords = coords;

        if (this.element == null) throw new Error("element is null");

        Object.assign(this.element.style, {
            position: "sticky",
            left: coords.x + "px",
            top: coords.y + "px"
        });

        eventEmitter.emit(eventNames.displayed);

        if (this.displayTarget == null) throw new Error("displayTarget is null or undefined");

        this.displayTarget.appendChild(this.element);
    };

    this.isShown = function () {
        return this.displayData.coords != null;
    };

    this.element = null;
    this.displayTarget = null;

    this.displayData = {
        coords: null
    };

    this.addButton = null;
};