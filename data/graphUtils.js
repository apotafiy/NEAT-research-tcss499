/**
 *
 * @param {array} data array of arrays of data
 */
const generateNodeChart = (data) => {
    const labels = [];
    // console.log(data.means);
    data.medians.forEach((elem, i) => {
        labels.push(i);
    });
    if (document.getElementById('nodeChart') != undefined) {
        document.getElementById('nodeChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'nodeChart');
    document.getElementById('nodeChartContainer').appendChild(ctx);
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Min Nodes',
                    data: data.mins,
                    fill: true,
                    backgroundColor: ['rgba(150,0,0,0.2)'],
                    borderColor: ['rgba(200,0,0,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Median Nodes',
                    data: data.medians,
                    fill: true,
                    backgroundColor: ['rgba(200,0,200,0.2)'],
                    borderColor: ['rgba(200,0,200,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Max Nodes',
                    data: data.maxes,
                    fill: true,
                    backgroundColor: ['rgba(0,50,255,0.2)'],
                    borderColor: ['rgba(0,50,255,1)'],
                    borderWidth: 3,
                },
                
            ],
        },
        options: {
            scales: {
                y: {
                    min: 10,
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
 * @param {array} data array of arrays of data
 */
const generateCycleChart = (data) => {
    const labels = [];
    // console.log(data.means);
    data.medians.forEach((elem, i) => {
        labels.push(i);
    });
    if (document.getElementById('cycleChart') != undefined) {
        document.getElementById('cycleChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'cycleChart');
    document.getElementById('cycleChartContainer').appendChild(ctx);
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Min Cycles',
                    data: data.mins,
                    fill: true,
                    backgroundColor: ['rgba(200,0,0,0.2)'],
                    borderColor: ['rgba(150,0,0,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Median Cycles',
                    data: data.medians,
                    fill: true,
                    backgroundColor: ['rgba(200,0,200,0.2)'],
                    borderColor: ['rgba(200,0,200,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Max Cycles',
                    data: data.maxes,
                    fill: true,
                    backgroundColor: ['rgba(0,50,255,0.2)'],
                    borderColor: ['rgba(0,50,255,1)'],
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
 * @param {array} data array of arrays of data
 */
const generateConnectionChart = (data) => {
    const labels = [];
    // console.log(data.means);
    data.medians.forEach((elem, i) => {
        labels.push(i);
    });
    if (document.getElementById('connectionChart') != undefined) {
        document.getElementById('connectionChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'connectionChart');
    document.getElementById('connectionChartContainer').appendChild(ctx);
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Min Connections',
                    data: data.mins,
                    fill: true,
                    backgroundColor: ['rgba(150,0,0,0.2)'],
                    borderColor: ['rgba(200,0,0,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Median Connections',
                    data: data.medians,
                    fill: true,
                    backgroundColor: ['rgba(200,0,200,0.2)'],
                    borderColor: ['rgba(200,0,200,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Max Connections',
                    data: data.maxes,
                    fill: true,
                    backgroundColor: ['rgba(0,50,255,0.2)'],
                    borderColor: ['rgba(0,50,255,1)'],
                    borderWidth: 3,
                },
                
            ],
        },
        options: {
            scales: {
                y: {
                    min: 25,
                    // beginAtZero: true,
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
 * @param {array} data array of arrays of data
 */
const generateEnergyChart = (data) => {};

/**
 *
 * @param {array} data array of arrays of data
 */
const generateAgeChart = (data) => {
    const labels = [];
    // console.log(data.means);
    data.medians.forEach((elem, i) => {
        labels.push(i);
    });
    if (document.getElementById('ageChart') != undefined) {
        document.getElementById('ageChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'ageChart');
    document.getElementById('ageChartContainer').appendChild(ctx);
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Median Age',
                    data: data.medians,
                    fill: true,
                    backgroundColor: ['rgba(150,0,0,0.2)'],
                    borderColor: ['rgba(200,0,0,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Mean Age',
                    data: data.means,
                    fill: true,
                    backgroundColor: ['rgba(200,0,200,0.2)'],
                    borderColor: ['rgba(200,0,200,1)'],
                    borderWidth: 3,
                },
                {
                    label: 'Oldest Agent',
                    data: data.oldest,
                    fill: true,
                    backgroundColor: ['rgba(0,50,255,0.2)'],
                    borderColor: ['rgba(0,50,255,1)'],
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
    // const labels = [];
    // data[0].forEach((elem, i) => {
    //     labels.push(i);
    // });
    if (document.getElementById('foodLifeStageChart') != undefined) {
        document.getElementById('foodLifeStageChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'foodLifeStageChart');
    document.getElementById('foodLifeStageChartContainer').appendChild(ctx);

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: labels,
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
            elements: {
                line: {
                    tension: 0.2,
                },
            },
        },
    });

    // const myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         datasets: [
    //             
    //         ],
    //     },
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //             },
    //         },
    //     },
    // });
};
