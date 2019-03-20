describe("Coords tests", function () {
    it("Test defined", function () {
        expect(FeedbackWidget.Coords).toBeDefined();
    });
    it("Test correct attributes", function () {
        let coords = new FeedbackWidget.Coords(5, 8);

        expect(coords.x).not.toBe(undefined);
        expect(coords.y).not.toBe(undefined);
        expect(coords.x).toBe(5);
        expect(coords.y).toBe(8);
    });
    it("Test Coords.parse defined", function () {
        expect(FeedbackWidget.Coords.parse).toBeDefined();
    });
    it("Test correct attributes", function () {
        let coordsString = "5,8";

        let coords = FeedbackWidget.Coords.parse(coordsString);

        expect(coords.x).not.toBe(undefined);
        expect(coords.y).not.toBe(undefined);
        expect(coords.x).toBe(5);
        expect(coords.y).toBe(8);
    });
    it("Test wrong input throws Error", function () {
        let coordsString = "5,d";

        expect(() => FeedbackWidget.Coords.parse(coordsString)).toThrowError();
    });
    it("Test wrong input throws Error", function () {
        let coordsString = "d,8";

        expect(() => FeedbackWidget.Coords.parse(coordsString)).toThrowError();
    });
    it("Test wrong input throws Error", function () {
        let coordsString = "5,6,8";

        expect(() => FeedbackWidget.Coords.parse(coordsString)).toThrowError();
    });
});