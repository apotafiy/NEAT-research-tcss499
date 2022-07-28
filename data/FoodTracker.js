class FoodTracker {
    static percentileMapping = [
            {
                key: '50',
                val: 0.5
            },
            {
                key: '75', 
                val: 0.75
            },
            {
                key: '90',
                val: 0.9
            },
            {
                key: '100',
                val: 1
            }
        ];
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
        const tickPercentile = {
            foodCount: 0,
        };
        // pretty sure array notation required for number variable names
        // downside is I have to remember to use array notation
        tickPercentile['50'] = undefined;
        tickPercentile['75'] = undefined;
        tickPercentile['90'] = undefined;
        tickPercentile['100'] = undefined;
        this.generations[this.currentGeneration] = {
            lifeStageCounts: [0, 0, 0, 0],
            caloriesConsumed: 0,
            consumptionTicks: [], // records the time when a food was consumed
            tickPercentile, // tracks what time a certain percent of food was consumed
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
            gameEngine.population.tickCounter
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
        const dataSets = [];
        FoodTracker.percentileMapping.forEach((obj) => {
            const data = this.generations.map((gen) => gen.tickPercentile[obj.key]);
            dataSets.push(data);
        });
        return dataSets;
    }

    computePercentiles() {
        // ticks.sort((a, b) => a - b); // sorted shouldn't be needed due to insertion order
        const getPercentile = (ticks, fraction, foodCount) => {
            const index = Math.floor((foodCount - 1) * fraction);
            let ret = null;
            if (index < ticks.length) {
                ret = ticks[index];
            }
            return ret;
        };
        FoodTracker.percentileMapping.forEach((obj)=> {
            this.generations[this.currentGeneration].tickPercentile[obj.key] =
            getPercentile(
                this.generations[this.currentGeneration].consumptionTicks,
                obj.val,
                this.generations[this.currentGeneration].tickPercentile.foodCount
            );
        });
        // console.log(this.generations[this.currentGeneration].tickPercentile);
        // this.generations[this.currentGeneration].tickPercentile['75'] =
        //     getPercentile(
        //         this.generations[this.currentGeneration],
        //         0.75,
        //         foodCount
        //     );
        // this.generations[this.currentGeneration].tickPercentile['90'] =
        //     getPercentile(
        //         this.generations[this.currentGeneration],
        //         0.9,
        //         foodCount
        //     );
        // this.generations[this.currentGeneration].tickPercentile['100'] =
        //     getPercentile(
        //         this.generations[this.currentGeneration],
        //         1,
        //         foodCount
        //     );
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
