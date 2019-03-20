/**
 *
 * @param {string} eventName
 * @param {EventModule.EventEmitter} eventEmitter
 * @constructor
 */
EventModule.EventSubscriber = function (eventName, eventEmitter) {
    this.subscribe = callback => eventEmitter.subscribe(eventName, callback);
    this.unsubscribe = callback => eventEmitter.unsubscribe(eventName, callback);
};