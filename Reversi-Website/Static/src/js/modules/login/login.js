SPA.Login = (function () {

    /**
     *
     * @param {string} loginFormId
     * @private
     */
    let _init = function (loginFormId) {
        /**
         *
         * @type {HTMLFormElement}
         */
        let loginForm = document.getElementById(loginFormId);

        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let data = new FormData(loginForm);
            let username = data.get("username");
            let password = data.get("password");

            SPA.login({
                Username: username,
                PasswordHash: password,
            })
        });
    };

    return {
        init: _init
    }
})();