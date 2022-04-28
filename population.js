class PopulationManager {

    static SPECIES_ID = 0;
    static GEN_NUM = 0;
    static SPECIES_CREATED = 0;
    static SPECIES_COLORS = new Map();
    static SPECIES_MEMBERS = new Map();
    static COLORS_USED = new Set();

    constructor(game) {
        this.game = game;
        this.agents = [];
        this.food = [];
        this.foodTracker = new FoodTracker();
        this.agentTracker = new AgentTracker();
        this.tickCounter = 0;
        let defaultColor = randomInt(361);
        PopulationManager.COLORS_USED.add(defaultColor);
        PopulationManager.SPECIES_COLORS.set(0, defaultColor);
        this.spawnAgents();
        this.spawnFood();
    };

    update() {
        params.AGENT_NEIGHBORS = document.getElementById("agent_neighbors").checked;
        params.FOOD_OUTSIDE = document.getElementById("food_outside_circle").checked;
        params.ENFORCE_MIN_FOOD = document.getElementById("enforce_min_food").checked;
        params.MIN_FOOD = parseInt(document.getElementById("min_food").value);

        for (let i = this.food.length - 1; i >= 0; --i) { // remove eaten or dead food
            if (this.food[i].removeFromWorld) {
                this.food.splice(i, 1);
            }
        }

        if (params.ENFORCE_MIN_FOOD && this.food.length < params.MIN_FOOD) {
            this.spawnFood(params.MIN_FOOD - this.food.length);
        }

        this.tickCounter++;
        if (this.tickCounter === params.GEN_TICKS) { // we've reached the end of the generation
            params.COMPAT_THRESH = parseFloat(document.getElementById("compat_threshold").value);
            this.tickCounter = 0;
            this.processGeneration();
            params.GEN_TICKS = parseInt(document.getElementById("generation_time").value);
            if (this.food.length === 0) {
                this.spawnFood();
            }
        }
    };

    spawnAgents() {
        PopulationManager.SPECIES_MEMBERS.set(PopulationManager.SPECIES_ID, []);
        PopulationManager.SPECIES_CREATED++;
        for (let i = 0; i < 50; i++) { // add agents
            let agent = new Agent(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2);
            agent.speciesId = PopulationManager.SPECIES_ID;
            PopulationManager.SPECIES_MEMBERS.get(PopulationManager.SPECIES_ID).push(agent);
            this.game.addEntity(agent);
            this.agents.push(agent);
        }
    };

    spawnFood(count = params.MIN_FOOD) {
        let seedlings = [];
        for (let i = 0; i < count; i++) { // add food sources
            let randomDist = randomInt(params.CANVAS_SIZE / 2);
            let randomAngle = randomInt(360) * Math.PI / 180;
            let x = params.CANVAS_SIZE / 2 + randomDist * Math.cos(randomAngle);
            let y = params.CANVAS_SIZE / 2 + randomDist * Math.sin(randomAngle);
            let food = new Food(this.game, x, y, false, this.foodTracker);
            seedlings.push(food);
        }
        this.registerSeedlings(seedlings);
    };

    registerSeedlings(seedlings) {
        seedlings.forEach(seedling => {
            this.food.push(seedling);
            this.game.addEntity(seedling);
        });
    };

    processGeneration() {
        this.agents.forEach(agent => {
            this.agentTracker.processAgent(agent);
            agent.age++;
            agent.assignFitness();
        });

        this.agents.sort((a1, a2) => a1.genome.rawFitness - a2.genome.rawFitness);

        for (let i = Math.floor(this.agents.length / 2) - 1; i >= 0; --i) { // remove unfit bottom half of agents
            this.agents[i].removeFromWorld = true;
            this.agents.splice(i, 1);
        }

        Genome.resetInnovations(); // reset the innovation number mapping for newly created connections

        let remainingColors = new Set(); // we need to filter out the colors of species that have died out for reuse
        PopulationManager.SPECIES_MEMBERS = new Map();
        this.agents.forEach(agent => { // fill species members map with surviving best-fit parent agents
            if (PopulationManager.SPECIES_MEMBERS.get(agent.speciesId) === undefined) {
                PopulationManager.SPECIES_MEMBERS.set(agent.speciesId, []);
            }
            PopulationManager.SPECIES_MEMBERS.get(agent.speciesId).push(agent);
            remainingColors.add(PopulationManager.SPECIES_COLORS.get(agent.speciesId));
        });
        PopulationManager.COLORS_USED = new Set([...PopulationManager.COLORS_USED].filter(color => remainingColors.has(color)));

        let sharedFitnessMap = new Map();
        let sumShared = 0;
        let minShared = 0;
        PopulationManager.SPECIES_MEMBERS.forEach((speciesList, speciesId) => {
            let sumRaws = 0;
            speciesList.forEach(member => {
                sumRaws += member.genome.rawFitness;
            });
            minShared = Math.min(minShared, sumRaws);
            sumShared += sumRaws / speciesList.length;
            sharedFitnessMap.set(speciesId, sumRaws / speciesList.length);
        });
        if (minShared < 0) {
            sumShared = 0;
            sharedFitnessMap.forEach((fitness, speciesId) => {
                sharedFitnessMap.set(speciesId, fitness + minShared * -1);
                sumShared += sharedFitnessMap.get(speciesId);
            });
        }
        let rouletteOrder = [...sharedFitnessMap.keys()].sort();

        let length = this.agents.length;
        let children = [];
        for (let i = 0; i < length; i++) { // randomly produce offspring between n pairs of remaining agents
            let rouletteResult = randomFloat(sumShared);
            let rouletteIndex = 0;
            let accumulator = 0;
            let flag = false;
            let parent1, parent2;
            while (!flag) {
                let nextSpecies = rouletteOrder[rouletteIndex];
                accumulator += sharedFitnessMap.get(nextSpecies);
                if (accumulator >= rouletteResult) {
                    flag = true;
                    let possibleParents = PopulationManager.SPECIES_MEMBERS.get(nextSpecies);
                    parent1 = possibleParents[randomInt(possibleParents.length)];
                    parent2 = possibleParents[randomInt(possibleParents.length)];
                }
                rouletteIndex++;
            }
            let childGenome = Genome.crossover(parent1.genome, parent2.genome);
            childGenome.mutate();
            let child = new Agent(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2, childGenome);
            children.push(child);
        }

        let repMap = new Map();
        PopulationManager.SPECIES_MEMBERS.forEach((speciesList, speciesId) => {
            // choose a random rep from each species
            repMap.set(speciesId, speciesList[randomInt(speciesList.length)]);
        });

        let compatOrder = [...PopulationManager.SPECIES_MEMBERS.keys()].sort(); // sort by speciesId such that compatibility is always considered in the same order
        children.forEach(child => { // fit child into a species
            let matchFound = false;
            compatOrder.forEach(speciesId => {
                let rep = repMap.get(speciesId);
                if (!matchFound && Genome.similarity(rep.genome, child.genome) <= params.COMPAT_THRESH) { // species matched
                    matchFound = true;
                    child.speciesId = speciesId;
                    PopulationManager.SPECIES_MEMBERS.get(speciesId).push(child);
                }
            });

            if (!matchFound) { // no compatible, create a new species
                PopulationManager.SPECIES_CREATED++;
                child.speciesId = ++PopulationManager.SPECIES_ID;
                PopulationManager.SPECIES_MEMBERS.set(child.speciesId, []);
                let newColor = randomInt(361);
                while (PopulationManager.COLORS_USED.has(newColor)) {
                    newColor = randomInt(361);
                }
                PopulationManager.COLORS_USED.add(newColor);
                PopulationManager.SPECIES_COLORS.set(child.speciesId, newColor);
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
        generateAgeChart(this.agentTracker.getAgeData());
        generateFoodConsumptionChart(this.foodTracker.getConsumptionData());
        generateFoodStageChart(this.foodTracker.getLifeStageData());
        this.foodTracker.addNewGeneration();
        this.agentTracker.addNewGeneration();
    };
};