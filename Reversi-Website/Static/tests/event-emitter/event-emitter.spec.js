describe("Event emitter tests", function () {
    it("is defined", function () {
        expect(EventModule).toBeDefined();
    });
    it("Expect event to be called", function () {
        //Arrange
        let eventEmitter = new EventModule.EventEmitter();

        let testFuncObj = {
            testFunc: function () {
                console.log("called!");
            }
        };

        let spy = spyOn(testFuncObj, "testFunc");

        eventEmitter.subscribe("test-event", testFuncObj.testFunc);

        //Act
        eventEmitter.emit("test-event");

        //Assert
        expect(spy).toHaveBeenCalled();
    });
    it("Expect event to be called", function () {
        //Arrange
        let eventEmitter = new EventModule.EventEmitter();

        let testFuncObj = {
            testFunc: function () {
                console.log("called!");
            }
        };

        let spy = spyOn(testFuncObj, "testFunc");

        eventEmitter.subscribe("test-event", testFuncObj.testFunc);
        eventEmitter.unsubscribe("test-event", testFuncObj.testFunc);

        //Act
        eventEmitter.emit("test-event");

        //Assert
        expect(spy).not.toHaveBeenCalled();
    })
});