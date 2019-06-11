describe("SPA-module", function () {
    beforeEach(function () {

    });

    afterEach(function () {
    });

    it("is defined", function () {
        expect(SPA.Data).toBeDefined();
        expect(SPA.Data.init).toBeDefined();
    });
    describe("fetchLobbies", function () {
        const responseJSON = [{
            "id": 1,
            "contentType": "application/json",
            "game": {
                "boardInfo": {
                    "size": "8, 8",
                    "pieces": [
                        {"colour": "FFFFFF", "position": {"x": 3, "y": 3}},
                        {"colour": "000000", "position": {"x": 3, "y": 4}},
                        {"colour": "000000", "position": {"x": 4, "y": 3}},
                        {"colour": "FFFFFF", "position": {"x": 4, "y": 4}}
                    ]
                },
                "players": [
                    {"colour": "FFFFFF", "score": 2},
                    {"colour": "000000", "score": 2}
                ],
                "currentPlayer": {"colour": "FFFFFF", "score": 2},
                "moves": null
            },
            "users": [
                {"id": 0, "userName": "test-user"}
            ]
        }];

        let promiseHelper;

        beforeEach(function () {
            let fetchPromise = new Promise(function (resolve, reject) {
                promiseHelper = {
                    resolve: resolve,
                    reject: reject
                };
            });

            promiseHelper.resolve(new Response(JSON.stringify(responseJSON)));

            spyOn(window, "fetch").and.returnValue(fetchPromise);
        });

        it("fetches lobbies correctly", function () {
            //Arrange
            return SPA.Data.fetchLobbies()
                .then(function (data) {
                    expect(data[0].id).toBe(responseJSON[0].id);
                    expect(data[0].contentType).toBe(responseJSON[0].contentType);
                    expect(data[0].game.boardInfo.size).toBe(responseJSON[0].game.boardInfo.size);
                    expect(data[0].users[0].id).toBe(responseJSON[0].users[0].id);
                });
        });
    });
    describe("getPieceCoordinates", function () {
        const responseJSON = {
            "size": "8, 8",
            "pieces": [
                {"colour": "FFFFFF", "position": {"x": 3, "y": 3}},
                {"colour": "000000", "position": {"x": 3, "y": 4}},
                {"colour": "000000", "position": {"x": 4, "y": 3}},
                {"colour": "FFFFFF", "position": {"x": 4, "y": 4}}
            ]
        };

        let promiseHelper;

        beforeEach(function () {
            let fetchPromise = new Promise(function (resolve, reject) {
                promiseHelper = {
                    resolve: resolve,
                    reject: reject
                };
            });

            promiseHelper.resolve(new Response(JSON.stringify(responseJSON)));

            spyOn(window, "fetch").and.returnValue(fetchPromise);


        });

        it("transforms pieces correctly", function () {
            const WHITE_CODE = "FFFFFF";
            const BLACK_CODE = "000000";


            //Arrange
            return SPA.Data.pieceAPI.getPieceCoordinates()
                .then(function (data) {
                    expect(Object.keys(data)).toContain(WHITE_CODE);
                    expect(Object.keys(data)).toContain(BLACK_CODE);

                    /**
                     *
                     * @param {Reversi.Coords}first
                     * @param {Reversi.Coords}second
                     * @return {boolean}
                     */
                    const coords_equals = function (first, second) {
                        return first.equals(second);
                    };

                    jasmine.addCustomEqualityTester(coords_equals);

                    expect(data[WHITE_CODE]).toContain(new Reversi.Coords(3, 3));
                    expect(data[WHITE_CODE]).toContain(new Reversi.Coords(4, 4));

                    expect(data[BLACK_CODE]).toContain(new Reversi.Coords(3, 4));
                    expect(data[BLACK_CODE]).toContain(new Reversi.Coords(4, 3));
                });
        });
    })
});