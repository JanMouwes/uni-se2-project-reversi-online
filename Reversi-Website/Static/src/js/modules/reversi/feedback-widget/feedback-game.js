Reversi.Feedback = (function () {

    const types = {
        positive: "positive",
        negative: "negative"
    };

    let _moveMade = function (success) {
        let message = success ? "Zet gezet!" : "Zet niet gezet: er is iets misgegaan...";
        let type = success ? types.positive : types.negative;

        FeedbackWidget.createNotification(type, message);
    };

    return {
        move_success: () => _moveMade(true),
        move_failure: () => _moveMade(false)
    }
})();