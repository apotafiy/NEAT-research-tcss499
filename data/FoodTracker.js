class FoodTracker {
    constructor() {
        this.currentGeneration = -1;
        this.generations = [];
        this.addNewGeneration();
    }

    /**
     *  Increments generation and sets things up for the next generation
     */
    addNewGeneration() {
        this.currentGeneration++;
        this.generations[this.currentGeneration] = {
            lifeStageCounts: [0, 0, 0, 0],
            caloriesConsumed: 0,
            consumptionTicks: [],
            tickPercentile: {
                foodCount: 0 // params.NUM_AGENTS * params.FOOD_AGENT_RATIO,
            },
        };
    }

    /**
     * Records how many lifecycle stages were eaten each generation
     * E.g. counts how many seeds were consumed in a generation
     * @param {int} stage number representing food stage in lifecycle
     */
    addLifeStage(stage) {
        this.generations[this.currentGeneration].lifeStageCounts[stage]++;
    }

    /**
     * Records how many calories consumed each generation and at what time
     * @param {int} num number of calories consumed
     */
    addCalories(num) {
        this.generations[this.currentGeneration].caloriesConsumed += num;
    }

    /**
     * Records time when food was eaten
     */
    addTick(){
        this.generations[this.currentGeneration].consumptionTicks.push(
            PopulationManager.tickCounter
        );       
    }

    /**
     * Records when a new food is created in a generation.
     */
    addFood() {
        this.generations[this.currentGeneration].tickPercentile.foodCount++;
    }

    /**
     *
     * @returns calories data for graphing
     */
    getConsumptionData() {
        return this.generations.map((obj) => obj.caloriesConsumed);
    }

    getPercentileData(){
        
    }

    computePercentiles() {
        const ticks = this.generations[this.currentGeneration].consumptionTicks;
        ticks.sort((a, b) => a - b);
        const getPercentile = (ticks, fraction, foodCount) => {
            const index = Math.floor((foodCount - 1) * fraction);
            let ret = undefined;
            if (index < ticks.length) {
                ret = ticks[index];
            }
            return ret;
        };
        const foodCount =
            this.generations[this.currentGeneration].tickPercentile.foodCount;
        this.generations[this.currentGeneration].tickPercentile['50'] =
            getPercentile(
                this.generations[this.currentGeneration],
                0.5,
                foodCount
            );
        this.generations[this.currentGeneration].tickPercentile['75'] =
            getPercentile(
                this.generations[this.currentGeneration],
                0.75,
                foodCount
            );
        this.generations[this.currentGeneration].tickPercentile['90'] =
            getPercentile(
                this.generations[this.currentGeneration],
                0.9,
                foodCount
            );
        this.generations[this.currentGeneration].tickPercentile['100'] =
            getPercentile(
                this.generations[this.currentGeneration],
                1,
                foodCount
            );
    }

    /**
     *
     * @returns life stage data for graphing
     */
    getLifeStageData() {
        const seedMap = {};
        this.generations.forEach((obj, i) => {
            seedMap[i] = obj.lifeStageCounts[0];
        });
        const adMap = {};
        this.generations.forEach((obj, i) => {
            adMap[i] = obj.lifeStageCounts[1];
        });
        const adultMap = {};
        this.generations.forEach((obj, i) => {
            adultMap[i] = obj.lifeStageCounts[2];
        });
        const decMap = {};
        this.generations.forEach((obj, i) => {
            decMap[i] = obj.lifeStageCounts[3];
        });
        return [seedMap, adMap, adultMap, decMap];
    }
}
