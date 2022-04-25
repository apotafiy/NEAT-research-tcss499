/**
 *
 * @param {array} data array of calories consumed per generation
 */
const generateFoodConsumptionChart = (data) => {
    const labels = [];
    data.forEach((elem, i) => {
        labels.push(i);
    });
    if (document.getElementById('foodConsumptionChart') != undefined) {
        document.getElementById('foodConsumptionChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'foodConsumptionChart');
    document.getElementById('foodConsumptionChartContainer').appendChild(ctx);
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Calories Consumed Per Generation',
                    data: data,
                    fill: true,
                    backgroundColor: ['rgba(100,0,255,0.2)'],
                    borderColor: ['rgba(100,0,255,1)'],
                    borderWidth: 3,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            elements: {
                line: {
                    tension: 0.2,
                },
            },
        },
    });
};

/**
 *
 * @param {2d array} data array of arrays of life stage counts per generation
 */
const generateFoodStageChart = (data) => {
    if (document.getElementById('foodLifeStageChart') != undefined) {
        document.getElementById('foodLifeStageChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'foodLifeStageChart');
    document.getElementById('foodLifeStageChartContainer').appendChild(ctx);

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Seeds',
                    data: data[0],
                    backgroundColor: ['Yellow'],
                    borderColor: ['Yellow'],
                    borderWidth: 3,
                },
                {
                    label: 'Adolescents',
                    data: data[1],
                    backgroundColor: ['Green'],
                    borderColor: ['Green'],
                    borderWidth: 3,
                },
                {
                    label: 'Adults',
                    data: data[2],
                    backgroundColor: ['Blue'],
                    borderColor: ['Blue'],
                    borderWidth: 3,
                },
                {
                    label: 'Decaying',
                    data: data[3],
                    backgroundColor: ['Orange'],
                    borderColor: ['Orange'],
                    borderWidth: 3,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};
