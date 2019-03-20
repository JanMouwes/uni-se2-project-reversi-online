EventModule.EventEmitter  = function() {
    /**
     *
     * @type {Array<string, Array<function>>}
     */
    let eventCallbacks = [];

    /**
     *
     * @param {string} eventName
     * @param {function} callback
     */
    this.subscribe = (eventName, callback) => {
        if (!Object.keys(eventCallbacks).includes(eventName))
            eventCallbacks[eventName] = [];

        eventCallbacks[eventName].push(callback);
    };

    /**
     *
     * @param {string} eventName
     * @param {function} callback
     */
    this.unsubscribe = (eventName, callback) => {
        if (!Object.keys(eventCallbacks).includes(eventName)) return;
        if (!eventCallbacks[eventName].includes(callback)) return;

        let callbackList = eventCallbacks[eventName];

        callbackList.splice(callbackList.indexOf(callback), 1);

        eventCallbacks[eventName] = callbackList;
    };

    /**
     *
     * @param {string} eventName
     */
    this.emit = (eventName) => {
        if (!Object.keys(eventCallbacks).includes(eventName)) return;

        eventCallbacks[eventName].forEach(item => item.call());
    };
};