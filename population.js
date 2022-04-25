class PopulationManager {

    static MIN_FOOD = 100;
    static MAX_FOOD = 200;
    static COMPAT_THRESHOLD = 0.1;
    static SPECIES_ID = 0;
    static GEN_NUM = 0;
    static SPECIES_CREATED = 0;
    static SPECIES_COLORS = new Map();
    static SPECIES_MEMBERS = new Map();

    constructor(game) {
        this.game = game;
        this.agents = [];
        this.food = [];
        this.foodTracker = new FoodTracker();
        PopulationManager.SPECIES_COLORS.set(0, randomInt(361));
        this.spawnAgents();
        this.spawnFood();
        this.startGeneration();
        this.reproduceFood();
    };

    startGeneration() {
        this.timer = 15.0;
        setTimeout(() => this.processGeneration(), 15000);
    };

    update() {
        this.timer = Math.max(0, this.timer - this.game.clockTick);
    };

    reproduceFood() {
        setTimeout(() => {
            for (let i = this.food.length - 1; i >= 0; --i) {
                if (this.food[i].removeFromWorld) {
                    this.food.splice(i, 1);
                }
            }

            if (this.food.length < PopulationManager.MAX_FOOD) {
                if (this.food.length < PopulationManager.MIN_FOOD) {
                    this.spawnFood(PopulationManager.MAX_FOOD - this.food.length);
                }
                this.food.forEach(food => {
                    if (food.isAdult()) {
                        food.reproduce().forEach(seedling => {
                            this.food.push(seedling);
                            this.game.addEntity(seedling);
                        });
                    }
                });
            }

            this.reproduceFood();
        }, 1000);
    };

    spawnAgents() {
        PopulationManager.SPECIES_MEMBERS.set(PopulationManager.SPECIES_ID, []);
        PopulationManager.SPECIES_CREATED++;
        for (let i = 0; i < 100; i++) { // add agents
            let agent = new Agent(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2);
            agent.speciesId = PopulationManager.SPECIES_ID;
            PopulationManager.SPECIES_MEMBERS.get(PopulationManager.SPECIES_ID).push(agent);
            this.game.addEntity(agent);
            this.agents.push(agent);
        }
    };

    spawnFood(count = PopulationManager.MAX_FOOD) {
        for (let i = 0; i < count; i++) { // add food sources
            let food = new Food(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1), false, this.foodTracker);
            this.game.addEntity(food);
            this.food.push(food);
        }
    };

    processGeneration() {
        this.agents.forEach(agent => {
            agent.assignFitness();
        });

        this.agents.sort((a1, a2) => a1.genome.rawFitness - a2.genome.rawFitness);

        for (let i = Math.floor(this.agents.length / 2) - 1; i >= 0; --i) { // remove unfit bottom half of agents
            this.agents[i].removeFromWorld = true;
            this.agents.splice(i, 1);
        }

        Genome.resetInnovations(); // reset the innovation number mapping for newly created connections

        PopulationManager.SPECIES_MEMBERS = new Map();
        this.agents.forEach(agent => { // fill species members map with surviving best-fit parent agents
            if (PopulationManager.SPECIES_MEMBERS.get(agent.speciesId) === undefined) {
                PopulationManager.SPECIES_MEMBERS.set(agent.speciesId, []);
            }
            PopulationManager.SPECIES_MEMBERS.get(agent.speciesId).push(agent);
        });

        let parentSpecies = [];
        PopulationManager.SPECIES_MEMBERS.forEach((speciesList, speciesId) => parentSpecies.push(speciesId));
        parentSpecies.sort();

        let length = this.agents.length;
        let speciesIndex = 0;
        let children = [];
        for (let i = 0; i < length; i++) { // randomly produce offspring between n pairs of remaining agents
            // let parent1 = this.agents[randomInt(this.agents.length)];
            // let parent2 = this.agents[randomInt(this.agents.length)];
            let parent1 = PopulationManager.SPECIES_MEMBERS.get(parentSpecies[speciesIndex])[randomInt(PopulationManager.SPECIES_MEMBERS.get(parentSpecies[speciesIndex]).length)];
            let parent2 = PopulationManager.SPECIES_MEMBERS.get(parentSpecies[speciesIndex])[randomInt(PopulationManager.SPECIES_MEMBERS.get(parentSpecies[speciesIndex]).length)];
            let childGenome = Genome.crossover(parent1.genome, parent2.genome);
            childGenome.mutate();
            let child = new Agent(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2, childGenome);
            children.push(child);
            speciesIndex = (speciesIndex + 1) % parentSpecies.length;
        }

        let repMap = new Map();
        PopulationManager.SPECIES_MEMBERS.forEach((speciesList, speciesId) => {
            // choose a random rep from each species
            repMap.set(speciesId, speciesList[randomInt(speciesList.length)]);
        });

        children.forEach(child => { // fit child into a species
            let matchFound = false;
            repMap.forEach((rep, speciesId) => {
                if (!matchFound && Genome.similarity(rep.genome, child.genome) <= PopulationManager.COMPAT_THRESHOLD) { // species matched
                    matchFound = true;
                    child.speciesId = speciesId;
                    PopulationManager.SPECIES_MEMBERS.get(speciesId).push(child);
                }
            });

            if (!matchFound) { // no compatible, create a new species
                PopulationManager.SPECIES_CREATED++;
                child.speciesId = ++PopulationManager.SPECIES_ID;
                PopulationManager.SPECIES_MEMBERS.set(child.speciesId, []);
                PopulationManager.SPECIES_COLORS.set(child.speciesId, randomInt(361));
                PopulationManager.SPECIES_MEMBERS.get(child.speciesId).push(child);
            }

            this.game.addEntity(child);
            this.agents.push(child);
        });

        this.agents.forEach(agent => {
            agent.resetPos();
            agent.resetOrigin();
            agent.resetEnergy();
        });

        PopulationManager.GEN_NUM++;
        generateFoodConsumptionChart(this.foodTracker.getConsumptionData());
        generateFoodStageChart(this.foodTracker.getLifeStageData());
        this.foodTracker.addNewGeneration();
        this.startGeneration();
    };
};