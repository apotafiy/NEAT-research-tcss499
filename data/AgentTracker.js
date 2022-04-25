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
            agent.NUMGENERATIONS,
            this.generations[this.currentGeneration].oldest
        );
        this.generations[this.currentGeneration].ages.push(
            agent.NUMGENERATIONS
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

    getMedian(arr) {
        arr.sort((a, b) => a - b);
        return arr[Math.floor(arr.length / 2)];
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
        const medianAges = this.generations.map((obj) =>
            this.getMedian(obj.age)
        );
        return {
            oldest: maxAges,
            medians: medianAges,
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
