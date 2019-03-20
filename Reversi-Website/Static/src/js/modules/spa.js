let SPA = (function () {

    let _init = function () {
        SPA.Data.init();
        SPA.LongPollDevice.init();

        return true;
    };

    return {
        init: _init
    }
})();