const FeedbackWidget = (function () {

    let _target;

    let StorageManager = (function () {
        const MESSAGES_STORAGE_KEY = "FeedbackWidget-messages";
        const MAX_MESSAGE_COUNT = 10;

        /**
         *
         * @param {FeedbackWidget.Notification} notification
         */
        let _store = function (notification) {
            const storage = window.localStorage;

            let messages_string = storage.getItem(MESSAGES_STORAGE_KEY);
            let messages = (messages_string != null) ? JSON.parse(messages_string) : [];

            let new_messages = [];
            new_messages.push(notification);

            //  Add maximum of nine messages to the end of the array
            while (messages.length > 0) {
                if (new_messages.length >= MAX_MESSAGE_COUNT) break;

                let value = messages.shift();

                new_messages.push(value);
            }

            storage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(new_messages));
        };

        let _clear = function () {
            const storage = window.localStorage;

            if (storage.getItem(MESSAGES_STORAGE_KEY) == null) return;

            storage.removeItem(MESSAGES_STORAGE_KEY);
        };

        return {
            store: _store,
            clear: _clear
        }
    })();

    let ElementFactory = (function () {
        /**
         *
         * @return {HTMLElement}
         * @private
         */
        let _createCloseButton = function () {
            //  TODO make single class out of this.
            const closeButtonSymbol = "&#10761;"; //Cross-symbol

            let closeButton = document.createElement("span");

            closeButton.innerHTML = closeButtonSymbol;
            closeButton.classList.add("close-button");

            return closeButton;
        };

        /**
         *
         * @param label
         * @return {{clicked: EventModule.EventSubscriber, element: HTMLElement}}
         * @private
         */
        let _createButton = function (label) {
            let element = document.createElement("button");
            const eventName = "event-click";

            let eventEmitter = new EventModule.EventEmitter();
            let eventSubscriber = new EventModule.EventSubscriber(eventName, eventEmitter);

            element.innerText = label;

            element.classList.add("button");

            element.addEventListener("click", function () {
                eventEmitter.emit(eventName);
            });

            return {
                clicked: eventSubscriber,
                element: element
            };
        };

        /**
         *
         * @param {FeedbackWidget.Notification} notification
         * @return {HTMLDivElement}
         */
        let _create = function (notification) {

            const whitelisted_types = [
                "positive", "negative", "neutral"
            ];

            if (!whitelisted_types.includes(notification.type)) notification.type = "neutral";

            let feedbackWidgetClass = "feedback-widget-" + notification.type;

            let element = document.createElement("div");
            element.classList.add(feedbackWidgetClass);

            let titleElement = document.createElement("span");
            titleElement.classList.add("feedback-widget-title");
            titleElement.innerHTML = notification.title;
            element.appendChild(titleElement);

            let contentElement = document.createElement("span");
            contentElement.classList.add("feedback-widget-content");
            contentElement.innerHTML = notification.content;
            element.appendChild(contentElement);

            let closeButton = _createCloseButton();
            closeButton.addEventListener("click", function () {
                if (notification.close == null) return;

                notification.close();
            }); //close parent
            element.appendChild(closeButton);

            return element;
        };

        return {
            create: _create,
            createButton: _createButton
        }
    })();

    /**
     *
     * @param {string} type
     * @param {string} title
     * @param {string} content
     * @returns {FeedbackWidget.Notification}
     * @private
     */
    let _createNotification = function (type, title, content = "") {

        let notification = new FeedbackWidget.Notification(type, title, content);

        notification.element = ElementFactory.create(notification);

        notification.displayed.subscribe(function () {
            StorageManager.store(notification);
        });

        /**
         *
         * @param label
         * @return {EventModule.EventSubscriber}
         */
        notification.addButton = function (label) {
            let button = ElementFactory.createButton(label);

            notification.element.appendChild(button.element);

            return button.clicked
        };

        notification.displayTarget = _target;

        return notification;
    };

    /**
     *
     * @param {HTMLElement} target
     * @return {boolean}
     * @private
     */
    let _init = (target) => {
        _target = target;

        return true;
    };

    return {
        createNotification: _createNotification,
        init: _init
    }

})();