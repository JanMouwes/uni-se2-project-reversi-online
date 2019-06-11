SPA.Chart = (function () {

    /**
     *
     * @param ctx
     * @param {Object<string, number>}astoroids_by_day
     * @return {Chart}
     * @private
     */
    let _createAsteroidChart = function (ctx, astoroids_by_day) {
        let data = Object.values(astoroids_by_day);
        let days = Object.keys(astoroids_by_day);

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: '# of asteroids:',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };

    return {
        createAsteroidChart: _createAsteroidChart
    }

})();