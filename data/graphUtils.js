/**
 *
 * @param {array} data array of calories consumed per generation
 */
const generateFoodConsumptionChart = (data) => {
    const labels = [];
    data.forEach((elem, i) => {
        labels.push(i);
    });
    if(document.getElementById('foodConsumptionChart') != undefined){
        document.getElementById('foodConsumptionChart').remove();
    }
    const ctx = document.createElement('canvas'); 
    ctx.setAttribute('id', 'foodConsumptionChart');
    document.getElementById('foodChartContainer').appendChild(ctx);
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
const generateFoodStageChart = (data) => {};
