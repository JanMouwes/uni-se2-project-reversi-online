SPA.LongPollDevice = (() => {
    let eventEmitter;

    let _init = () => {
        eventEmitter = new EventModule.EventEmitter();
    };

    let _sendRequest = (url) => {
        return window.fetch(url, {
            headers: {
                "Connection": "Keep-Alive"
            }
        })
    };

    let _watch = (url, eventName) => {
        let startRequest = () => _sendRequest(url).then(eventEmitter.emit(eventName));

        eventEmitter.subscribe(eventName, startRequest);

        startRequest();
    };

    return {
        init: _init,
        watch: _watch,
        subscribe: (eventName, callback) => eventEmitter.subscribe(eventName, callback),
        unsubscribe: (eventName, callback) => eventEmitter.unsubscribe(eventName, callback)
    }

})();