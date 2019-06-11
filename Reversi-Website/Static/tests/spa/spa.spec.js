describe("SPA-module", function () {
    beforeEach(function () {
        jasmine.Ajax.install();
        spyOn(SPA.Data, "init").and.returnValue(Promise.resolve());
        spyOn(SPA.Data, "startPolling").and.returnValue(null);
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("is defined", function () {
        expect(SPA).toBeDefined();
        expect(SPA.init).toBeDefined();
    });

    it("calls Data.login when login is called", function () {
        spyOn(SPA.Data, "login").and.returnValue(new Promise(() => {
            //Do nothing
        }));

        let login_object = {
            Username: "test",
            PasswordHash: "test2"
        };

        SPA.login(login_object);

        expect(SPA.Data.login).toHaveBeenCalledWith(login_object)
    });

    it("emits event when logged in", function () {
        //Arrange
        let test_callback_object = {
            test_callback: function () {

            }
        };

        spyOn(test_callback_object, "test_callback");
        spyOn(SPA.Data, "login").and.returnValue(Promise.resolve());

        //Act
        SPA.init();


        SPA.events.login.subscribe(test_callback_object.test_callback);

        SPA.login({
            Username: "test",
            PasswordHash: "test2"
        }).then(function () {
            expect(test_callback_object.test_callback).toHaveBeenCalled()
        });

    });

    it("starts new game with default scenario when onStartNewGame is called", function () {
        //Arrange
        spyOn(Reversi, "startNewGame").and.returnValue(Promise.resolve());

        //Act
        SPA.init();

        //Assert
        SPA.startNewGame()
            .then(function () {
                expect(Reversi.startNewGame).toHaveBeenCalledWith(0)
            });

    });

});