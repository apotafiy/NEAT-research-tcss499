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

    /**
     * 
     * @returns calories data for graphing
     */
    getConsumptionData(){
        return this.generations.map((obj)=>obj.caloriesConsumed);
    }

    /**
     * 
     * @returns life stage data for graphing
     */
    getLifeStageData(){
        const seedMap = {};
        this.generations.forEach((obj, i)=>{
            seedMap[i] = obj.lifeStageCounts[0];
        });
        const adMap = {};
        this.generations.forEach((obj, i)=>{
            adMap[i] = obj.lifeStageCounts[1];
        });
        const adultMap = {};
        this.generations.forEach((obj, i)=>{
            adultMap[i] = obj.lifeStageCounts[2];
        });
        const decMap = {};
        this.generations.forEach((obj, i)=>{
            decMap[i] = obj.lifeStageCounts[3];
        });
        return [seedMap, adMap, adultMap, decMap];
    }
}
