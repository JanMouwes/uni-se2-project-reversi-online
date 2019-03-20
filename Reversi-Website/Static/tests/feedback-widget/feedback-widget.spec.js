describe("Feedback-widget", function () {
    it("is defined", function () {
        expect(FeedbackWidget).toBeDefined();
        expect(FeedbackWidget.init).toBeDefined();
        expect(FeedbackWidget.createNotification).toBeDefined();
    });
    it("creates notification", function () {
        let type = "positive";
        let title = "test-title";
        let content = "test-content";
        let notification = FeedbackWidget.createNotification("positive", title, content);

        expect(notification.element).not.toBeNull();
        expect(notification.type).toBe(type);
        expect(notification.title).toBe(title);
        expect(notification.content).toBe(content);
    });

});