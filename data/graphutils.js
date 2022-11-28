/*
 * Sorry for spaghetti IDK how to do front end lol (Parker doesn't either)
 */

/**
 * If "Enforce Minimum Food" is on then the graph must be interpreted a little different since food is alway regenerated and the agents can never actually eat all the food.
 * That being said, the graph should still fundamentally show the same thing.
 * @param {array} timeData food consumption time for each generation
 */
 const generateFoodTimeChart = (timeData) => {
    const datasets = [];
    FoodTracker.percentileMapping.forEach((obj, i) => {
        let hue = 0;
        if(i == 1){
            hue = 50;
        } else if(i == 2) {
            hue = 100;
        } else if(i == 3) {
            hue = 230;
        }
        datasets.push({
            label: `${obj.key}%`,
            data: timeData[i],
            fill: false,
            borderColor: [hsl(hue, 100, 50)],
            backgroundColor: [hsl(hue, 100, 50)],
            borderWidth: 1,
        });
    });
    datasets.reverse();
    if (document.getElementById('foodTimeChart') != undefined) {
        document.getElementById('foodTimeChart').remove();
    }
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'foodTimeChart');
    document.getElementById('foodTimeChartContainer').appendChild(canvas);
    const labels = [];
    for(let i = 0 ; i < timeData[0].length; i++) {
        labels.push(i);
    }
    new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
                // x: {
                //     min: 0,
                // },
            },
            elements: {
                line: {
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: `Time to Consumption`,
                },
            },
        },
    });
};

/**
 *
 * @param {array} fitnessData all fitness data from agent tracker
 */
const generateFitnessChart = (fitnessData) => {
    if (document.getElementById('fitnessChart') != undefined) {
        document.getElementById('fitnessChart').remove();
    }
    const currSpecies = new Set();
    PopulationManager.SPECIES_MEMBERS.forEach((val, key) =>
        currSpecies.add(key)
    );
    const generations = [];
    fitnessData.forEach((gen) =>
        generations.push(gen.filter((obj) => currSpecies.has(obj.speciesId)))
    );
    const speciesFit = [];
    currSpecies.forEach((id) => {
        const { fitnesses, firstGen } = getFitnessDataSet(id, fitnessData);
        speciesFit.push({ speciesId: id, firstGen, fitnesses });
    });
    speciesFit.sort((a, b) => a.speciesId - b.speciesId);
    const canvas = getFitnessChart(speciesFit);
    canvas.setAttribute('id', 'fitnessChart');
    document.getElementById('fitnessChartContainer').appendChild(canvas);
};

const getFitnessDataSet = (id, fitnessData) => {
    const fitnesses = [];
    let firstGen = Number.MAX_VALUE;
    fitnessData.forEach((array, currentGeneration) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].speciesId == id) {
                firstGen = Math.min(firstGen, currentGeneration);
                fitnesses.push(array[i].fitness);
                break;
            }
        }
    });
    return { id, firstGen, fitnesses };
};

/**
 * Create canvas chart for species fitness over time.
 * @param {array} speciesFitnesses array of fitness data
 * @returns {html} canvas
 */
const getFitnessChart = (speciesFitnesses) => {
    const firstGen = speciesFitnesses.reduce(
        (acc, curr) => Math.min(curr.firstGen, acc),
        Number.MAX_VALUE
    );
    const longestGen = speciesFitnesses.reduce((acc, curr) => Math.max(acc, curr.fitnesses.length), 0);
    const labels = [];
    for (let i = firstGen; i < longestGen + firstGen; i++) {
        labels.push(i);
    }
    const datasets = [];
    speciesFitnesses.forEach((obj) => {
        while(obj.fitnesses.length < longestGen){
            obj.fitnesses.unshift(undefined);
        }
        datasets.push({
            label: `Species ${obj.speciesId}`,
            data: obj.fitnesses,
            fill: false,
            backgroundColor: [
                hsl(
                    PopulationManager.SPECIES_COLORS.get(obj.speciesId),
                    100,
                    50
                ),
            ],
            borderColor: [
                hsl(
                    PopulationManager.SPECIES_COLORS.get(obj.speciesId),
                    100,
                    50
                ),
            ],
            borderWidth: 1,
        });
    });
    const ctx = document.createElement('canvas');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: {
                    min: firstGen,
                },
            },
            elements: {
                line: {
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: `Species Fitness Over Time`,
                },
            },
        },
    });
    return ctx;
};

/**
 *
 * @param {2d array} data array of arrays of life stage counts per generation
 */
const generateCurrentFitnessChart = (data) => {
    if (document.getElementById('currentFitnessChart') != undefined) {
        document.getElementById('currentFitnessChart').remove();
    }
    const ctx = document.createElement('canvas');
    ctx.setAttribute('id', 'currentFitnessChart');
    document.getElementById('currentFitnessChartContainer').appendChild(ctx);

    const current = data[data.length - 1];
    current.sort((a, b) => a.speciesId - b.speciesId);
    const min = current.reduce(
        (acc, curr) => Math.min(curr.fitness, acc),
        Number.MAX_VALUE
    );
    const datasets = [];
    current.forEach((obj) => {
        const temp = {
            label: `ID: ${obj.speciesId}`,
            data: [obj.fitness],
            borderColor: [
                `hsl(${PopulationManager.SPECIES_COLORS.get(
                    obj.speciesId
                )}, 100%, 50%)`,
            ],
            backgroundColor: [
                `hsla(${PopulationManager.SPECIES_COLORS.get(
                    obj.speciesId
                )}, 100%, 50%, 0.7)`,
            ],
            borderWidth: 1,
        };
        datasets.push(temp);
    });

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [''],
            datasets,
        },
        options: {
            scales: {
                y: {
                    // min: Math.max(Math.floor(min - 100), 0),
                    beginAtZero: true,
                },
            },
            elements: {
                line: {
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Species Fitness',
                },
            },
        },
    });
};

/**
 *
 * @param {array} data array of arrays of data
 */
const generateNodeChart = (data) => {
    const labels = [];
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
                    fill: false,
                    backgroundColor: ['rgba(255,0,0,0.1)'],
                    borderColor: ['rgba(255,0,0,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Median Nodes',
                    data: data.medians,
                    fill: false,
                    backgroundColor: ['rgba(150,0,255,0.1)'],
                    borderColor: ['rgba(150,0,255,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Max Nodes',
                    data: data.maxes,
                    fill: false,
                    backgroundColor: ['rgba(0,0,255,0.1)'],
                    borderColor: ['rgba(0,0,255,1)'],
                    borderWidth: 1,
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
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Nodes in Neural Nets',
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
                    fill: false,
                    backgroundColor: ['rgba(255,0,0,0.1)'],
                    borderColor: ['rgba(255,0,0,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Median Cycles',
                    data: data.medians,
                    fill: false,
                    backgroundColor: ['rgba(150,0,255,0.1)'],
                    borderColor: ['rgba(150,0,255,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Max Cycles',
                    data: data.maxes,
                    fill: false,
                    backgroundColor: ['rgba(0,0,255,0.1)'],
                    borderColor: ['rgba(0,0,255,1)'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    // min: 10
                    beginAtZero: true,
                },
            },
            elements: {
                line: {
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Cycles in Neural Nets',
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
                    fill: false,
                    backgroundColor: ['rgba(255,0,0,0.1)'],
                    borderColor: ['rgba(255,0,0,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Median Connections',
                    data: data.medians,
                    fill: false,
                    backgroundColor: ['rgba(150,0,255,0.1)'],
                    borderColor: ['rgba(150,0,255,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Max Connections',
                    data: data.maxes,
                    fill: false,
                    backgroundColor: ['rgba(0,0,255,0.1)'],
                    borderColor: ['rgba(0,0,255,1)'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    // min: 25,
                    beginAtZero: true,
                },
            },
            elements: {
                line: {
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Connections in Neural Nets',
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
                    fill: false,
                    backgroundColor: ['rgba(255,0,0,0.1)'],
                    borderColor: ['rgba(255,0,0,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Mean Age',
                    data: data.means,
                    fill: false,
                    backgroundColor: ['rgba(150,0,255,0.1)'],
                    borderColor: ['rgba(150,0,255,1)'],
                    borderWidth: 1,
                },
                {
                    label: 'Oldest Agent',
                    data: data.oldest,
                    fill: false,
                    backgroundColor: ['rgba(0,0,255,0.1)'],
                    borderColor: ['rgba(0,0,255,1)'],
                    borderWidth: 1,
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
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Age of Agents',
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
                    fill: false,
                    backgroundColor: ['rgba(150,0,255,0.1)'],
                    borderColor: ['rgba(150,0,255,1)'],
                    borderWidth: 1,
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
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Calories Consumed Per Generation',
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
                    backgroundColor: ['rgb(255, 230, 0)'],
                    borderColor: ['rgb(255, 230, 0)'],
                    borderWidth: 1,
                },
                {
                    label: 'Adolescents',
                    data: data[1],
                    backgroundColor: ['Green'],
                    borderColor: ['Green'],
                    borderWidth: 1,
                },
                {
                    label: 'Adults',
                    data: data[2],
                    backgroundColor: ['Blue'],
                    borderColor: ['Blue'],
                    borderWidth: 1,
                },
                {
                    label: 'Decaying',
                    data: data[3],
                    backgroundColor: ['Orange'],
                    borderColor: ['Orange'],
                    borderWidth: 1,
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
                    tension: 0.1,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Food Consumed',
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
