const FeedbackWidget = (function () {

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
            const closeButtonSize = 15;
            const closeButtonSymbol = "&#10761;"; //Cross-symbol

            let closeButton = document.createElement("span");

            closeButton.innerHTML = closeButtonSymbol;
            Object.assign(closeButton.style, {
                //position in relation to parent element
                position: "absolute",
                right: "10px", //TODO find a way to make this dynamic
                top: "10px",
                //make x- and y-diameter equal
                width: closeButtonSize + "px",
                height: closeButtonSize + "px",
                //centre text
                textAlign: "center",
                lineHeight: closeButtonSize + "px",
                fontSize: closeButtonSize + "px",
                //make 'button' into circle with black border
                border: "1px solid black",
                borderRadius: closeButtonSize + "px",
                cursor: "pointer",
                backgroundColor: "#E6E6E6"
            });

            return closeButton;
        };

        let _createButton = function (label) {
            let element = document.createElement("button");
            const eventName = "event-click";

            let eventEmitter = new EventModule.EventEmitter();
            let eventSubscriber = new EventModule.EventSubscriber(eventName, eventEmitter);

            element.innerText = label;

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
            let feedbackWidgetClass;
            switch (notification.type) { //TODO find a better way of doing this
                case "positive":
                    feedbackWidgetClass = "feedback-widget-positive";
                    break;
                case "negative":
                    feedbackWidgetClass = "feedback-widget-negative";
                    break;
                default:
                case "neutral":
                    feedbackWidgetClass = "feedback-widget-neutral";
                    break;
            }

            let element = document.createElement("div");
            element.classList.add("feedback-widget", feedbackWidgetClass);

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

        return notification;
    };

    let _init = () => {

        return true;
    };

    return {
        createNotification: _createNotification,
        init: _init
    }

})();