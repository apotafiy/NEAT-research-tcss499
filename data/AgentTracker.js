class AgentTracker {
    constructor() {
        this.currentGeneration = -1;
        this.generations = [];
        this.addNewGeneration();
    }

    /**
     * Setup for new generation
     */
    addNewGeneration() {
        this.currentGeneration++;
        this.generations[this.currentGeneration] = {
            oldest: 0,
            ages: [],
            maxEnergy: 0,
            minEnergy: Number.MAX_VALUE,
            energy: [],
        };
    }

    /**
     * Private method
     * @param {object} agent agent object
     */
    addAge(agent) {
        this.generations[this.currentGeneration].oldest = Math.max(
            agent.age,
            this.generations[this.currentGeneration].oldest
        );
        this.generations[this.currentGeneration].ages.push(
            agent.age
        );
    }

    /**
     * Private method
     * @param {object} agent agent object
     */
    addEnergy(agent) {
        this.generations[this.currentGeneration].maxEnergy = Math.max(
            agent.energy,
            this.generations[this.currentGeneration].maxEnergy
        );
        this.generations[this.currentGeneration].minEnergy = Math.min(
            agent.energy,
            this.generations[this.currentGeneration].minEnergy
        );
        this.generations[this.currentGeneration].energy;
    }

    /**
     * Median age for non-new agents
     * @param {array} arr array of ages
     * @returns median age for non-new agents
     */
    getMedian(arr) {
        arr.sort((a, b) => a - b);
        return arr[Math.floor(arr.length / 2)];
    }

    getMean(arr){
        if(arr.length == 0) return 0;
        const total = arr.reduce((curr, acc)=> acc + curr, 0);
        return total / arr.length;
    }

    /**
     * Public method
     * @param {object} agent agent object
     */
    processAgent(agent) {
        this.addEnergy(agent);
        this.addAge(agent);
    }

    getAgeData() {
        const maxAges = this.generations.map((obj) => obj.oldest);
        // for mean and median we do not use all agents
        // we use only the agents from previous generations and now new agents
        // this is because half of all agents ages will be 0, thus leading to boring data
        // by filtering out agents with age 0 we ignore all new agents
        const topHalfAges = this.generations.map((obj) => obj.ages.filter((age) => age != 0));
        const medianAges = topHalfAges.map((ages) => this.getMedian(ages));
        const meanAges = topHalfAges.map((ages) => this.getMean(ages));
        return {
            oldest: maxAges,
            medians: medianAges,
            means: meanAges
        };
    }

    getEnergyData() {
        const minEnergies = this.generations.map((obj) => obj.minEnergy);
        const maxEnergies = this.generations.map((obj) => obj.maxEnergy);
        const medianEnergies = this.generations.map((obj) =>
            this.getMedian(obj.energy)
        );
        return {
            mins: minEnergies,
            maxes: maxEnergies,
            medians: medianEnergies,
        };
    }
}
