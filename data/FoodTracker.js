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
        };
    }

    /**
     * Records how many lifecycle stages were reached in each generation
     * E.g. counts how many seeds existed in a generation
     * @param {int} stage number representing food stage in lifecycle
     */
    addLifeStage(stage) {
        this.generations[this.currentGeneration].lifeStageCounts[stage]++;
    }

    /**
     * Records how many calories consumed each generation
     * @param {int} num number of calories consumed
     */
    addCalories(num) {
        this.generations[this.currentGeneration].caloriesConsumed += num;
    }

    getConsumptionData(){
        return this.generations.map((obj)=>obj.generations.caloriesConsumed);
    }

    getLifeStageData(){
        return [this.generations.map((obj)=>obj.lifeStageCounts[0]),
            this.generations.map((obj)=>obj.lifeStageCounts[1]),
            this.generations.map((obj)=>obj.lifeStageCounts[2]),
            this.generations.map((obj)=>obj.lifeStageCounts[3])] 
    }
}
