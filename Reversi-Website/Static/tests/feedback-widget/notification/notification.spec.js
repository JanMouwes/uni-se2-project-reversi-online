describe("Notification-class", function () {
    it("defined", function () {
        expect(FeedbackWidget.Notification).toBeDefined();
    });
    it("correct attributes", function () {
        let notification = new FeedbackWidget.Notification("positive", "test-title", "test-content");

        expect(notification.type).not.toBe(undefined);
        expect(notification.title).not.toBe(undefined);
        expect(notification.content).not.toBe(undefined);
        expect(notification.type).toBe("positive");
        expect(notification.title).toBe("test-title");
        expect(notification.content).toBe("test-content");
    });
    it("attribute: type: positive", function () {
        let notification = new FeedbackWidget.Notification("positive", "test-title", "test-content");

        expect(notification.type).not.toBe(undefined);
        expect(notification.type).toBe("positive");
    });
    it("attribute: type: negative", function () {
        let notification = new FeedbackWidget.Notification("negative", "test-title", "test-content");

        expect(notification.type).not.toBe(undefined);
        expect(notification.type).toBe("negative");
    });
    it("attribute: type: neutral", function () {
        let notification = new FeedbackWidget.Notification("neutral", "test-title", "test-content");
        let notification2 = new FeedbackWidget.Notification("", "test-title", "test-content");

        expect(notification.type).not.toBe(undefined);
        expect(notification.type).toBe("neutral");

        expect(notification2.type).not.toBe(undefined);
        expect(notification2.type).toBe("neutral");
    });

    it("closes when element is assigned", function () {
        let notification = new FeedbackWidget.Notification("neutral", "test-title", "test-content");

        let parent = document.createElement("div");
        notification.element = document.createElement("div");

        parent.appendChild(notification.element);

        spyOn(notification.element.parentNode, "removeChild");

        notification.close();

        expect(notification.element.parentNode.removeChild).toHaveBeenCalledWith(notification.element);
    });
    it("throws exception when no element given", function () {
        let notification = new FeedbackWidget.Notification("neutral", "test-title", "test-content");

        expect(function () {
            notification.display(5, 8);
        }).toThrowError();
    });
    it("emits event when displayed", function () {
        let notification = new FeedbackWidget.Notification("neutral", "test-title", "test-content");


        let testObject = {
            testMethod: function () {
            }
        };


        spyOn(testObject, "testMethod");

        notification.displayed.subscribe(testObject.testMethod);

        notification.element = document.createElement("div");

        notification.display(5, 8);

        expect(testObject.testMethod).toHaveBeenCalled();
    });
});