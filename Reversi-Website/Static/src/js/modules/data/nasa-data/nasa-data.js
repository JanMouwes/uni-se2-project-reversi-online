SPA.Data.NASA = (function () {
    const API_KEY = "ug3j2PoAJ9EyhF9YJtRcp9CL9W3d9ZDsKKsdwrw7";
    const BASE_URL = "https://api.nasa.gov/neo/rest/v1/feed";

    let _api_key; //TODO actually have this have any effect

    let _createUrl = function (startDate, endDate) {
        return BASE_URL + "?start_date=" + startDate + "&end_date=" + endDate + "&api_key=" + API_KEY;
    };

    /**
     *
     * @param {Date} date
     * @return {string}
     * @private
     */
    let _formatDate = date => date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    /**
     *
     * @param {Date} startDate
     * @param {Date} endDate
     * @return {Promise<Response>}
     * @private
     */
    let _fetchData = function (startDate, endDate) {
        let url = _createUrl(_formatDate(startDate), _formatDate(endDate));
        return window.fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject())
    };

    let _fetchDayCount = function (day_date) {
        return _fetchData(day_date, day_date)
            .then(data => data.element_count)
    };
    let _fetchRangeCount = function (start_date, end_date) {
        return _fetchData(start_date, end_date)
            .then(data => data.element_count)
    };

    let _init = function (api_key) {
        _api_key = api_key;
    };

    return {
        init: _init,
        fetchCount: {
            byDay: _fetchDayCount,
            byRange: _fetchRangeCount
        }
    }
})();