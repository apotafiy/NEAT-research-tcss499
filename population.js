class PopulationManager {

    static SPECIES_ID = 0;
    static GEN_NUM = 0;
    static SPECIES_CREATED = 0;
    static SPECIES_COLORS = new Map();
    static SPECIES_SENSOR_COLORS = new Map();
    static SPECIES_MEMBERS = new Map();
    static COLORS_USED = new Set();
    static SENSOR_COLORS_USED = new Set();
    static MIN_AGENTS = 50;

    constructor(game) {
        this.game = game;
        this.foodTracker = new FoodTracker();
        this.agentTracker = new AgentTracker();
        this.tickCounter = 0;
        this.genomeTracker = new GenomeTracker();
        let defaultColor = randomInt(361);
        PopulationManager.COLORS_USED.add(defaultColor);
        PopulationManager.SPECIES_COLORS.set(0, defaultColor);
        let defaultSensorColor = randomBlueHue();
        PopulationManager.SENSOR_COLORS_USED.add(defaultSensorColor);
        PopulationManager.SPECIES_SENSOR_COLORS.set(0, defaultSensorColor);
        
        this.worlds = new Map();
        this.initNewWorld(PopulationManager.SPECIES_ID);
        this.spawnAgents(PopulationManager.SPECIES_ID);
        this.spawnFood(PopulationManager.SPECIES_ID);
        this.resetCanvases();
    };

    resetSim() {
        PopulationManager.SPECIES_ID = 0;
        PopulationManager.GEN_NUM = 0;
        PopulationManager.SPECIES_CREATED = 0;
        PopulationManager.SPECIES_COLORS = new Map();
        PopulationManager.SPECIES_SENSOR_COLORS = new Map();
        PopulationManager.SPECIES_MEMBERS = new Map();
        PopulationManager.COLORS_USED = new Set();
        PopulationManager.SENSOR_COLORS_USED = new Set();
        Genome.resetAll();
        this.game.population = new PopulationManager(this.game);
    };

    update() {
        params.FREE_RANGE = document.getElementById("free_range").checked;
        params.AGENT_NEIGHBORS = document.getElementById("agent_neighbors").checked;
        params.FOOD_OUTSIDE = document.getElementById("food_outside_circle").checked;
        params.ENFORCE_MIN_FOOD = document.getElementById("enforce_min_food").checked;
        params.RAND_FOOD_PHASES = document.getElementById("rand_food_phases").checked;
        params.RAND_FOOD_LIFETIME = document.getElementById("rand_food_lifetime").checked;
        params.FOOD_PERIODIC_REPOP = document.getElementById("periodic_food_repop").checked;

        if (params.SPLIT_SPECIES && !document.getElementById("split_species").checked) {
            this.mergeWorlds();
        } else if (!params.SPLIT_SPECIES && document.getElementById("split_species").checked) {
            this.splitWorlds();
        }
        params.SPLIT_SPECIES = document.getElementById("split_species").checked;

        if (document.activeElement.id !== "food_agent_ratio") {
            params.FOOD_AGENT_RATIO = parseInt(document.getElementById("food_agent_ratio").value);
        }
        if (document.activeElement.id !== "agent_vision_radius") {
            params.AGENT_VISION_RADIUS = parseFloat(document.getElementById("agent_vision_radius").value);
        }
        if (document.activeElement.id !== "compat_threshold") {
            params.COMPAT_THRESH = parseFloat(document.getElementById("compat_threshold").value);
        }
        
        this.worlds.forEach((members, worldId) => {
            this.cleanupFood(worldId);
            if (params.ENFORCE_MIN_FOOD && members.food.length < params.FOOD_AGENT_RATIO * members.agents.length) { // add agent to food ratio here
                this.spawnFood(worldId, params.FOOD_AGENT_RATIO * members.agents.length - members.food.length);
            }
        });
        
        this.tickCounter++;
        if (this.tickCounter === params.GEN_TICKS) { // we've reached the end of the generation
            this.tickCounter = 0;
            this.processGeneration();
            if (document.activeElement.id !== "generation_time") {
                params.GEN_TICKS = parseInt(document.getElementById("generation_time").value);
            } 
            return true;
        }
        return false;
    };

    cleanupFood(worldId) {
        let foodList = this.worlds.get(worldId).food;
        for (let i = foodList.length - 1; i >= 0; --i) { // remove eaten or dead food
            if (foodList[i].removeFromWorld) {
                foodList.splice(i, 1);
            }
        }
    };

    checkFoodLevels() { // periodic food repopulation function
        this.worlds.forEach((members, worldId) => {
            this.cleanupFood(worldId);
            this.spawnFood(worldId, params.FOOD_AGENT_RATIO * members.agents.length - members.food.length);
        });
    };

    getEntitiesInWorld(worldId, foodOnly = false, agentsOnly = false) {
        let members = this.worlds.get(worldId);
        // uncomment the following code if you would like to add home to processed entities
        // if (!foodOnly && !agentsOnly) {
        //     entities.push(members.home);
        // }
        if (foodOnly) {
            return members.food;
        } else if (agentsOnly) {
            return members.agents;
        } else {
            return members.food.concat(members.agents);
        }
    };

    spawnAgents(worldId) {
        PopulationManager.SPECIES_MEMBERS.set(PopulationManager.SPECIES_ID, []);
        PopulationManager.SPECIES_CREATED++;
        for (let i = 0; i < PopulationManager.MIN_AGENTS; i++) { // add agents
            let agent = new Agent(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2);
            agent.speciesId = PopulationManager.SPECIES_ID;
            PopulationManager.SPECIES_MEMBERS.get(PopulationManager.SPECIES_ID).push(agent);
            this.worlds.get(worldId).agents.push(agent);
        }
    };

    spawnFood(worldId, count = params.FOOD_AGENT_RATIO * this.worlds.get(worldId).agents.length) {
        let seedlings = [];
        for (let i = 0; i < count; i++) { // add food sources
            let randomDist = randomInt(params.CANVAS_SIZE / 2);
            let randomAngle = randomInt(360) * Math.PI / 180;
            let x = params.CANVAS_SIZE / 2 + randomDist * Math.cos(randomAngle);
            let y = params.CANVAS_SIZE / 2 + randomDist * Math.sin(randomAngle);
            let food = new Food(this.game, x, y, false, this.foodTracker);
            seedlings.push(food);
        }
        this.registerSeedlings(worldId, seedlings);
    };

    registerSeedlings(worldId, seedlings) {
        seedlings.forEach(seedling => {
            seedling.worldId = worldId;
            this.worlds.get(worldId).food.push(seedling);
        });
    };

    registerChildAgents(children) {
        let repMap = new Map();
        PopulationManager.SPECIES_MEMBERS.forEach((speciesList, speciesId) => {
            // choose a rep for each species
            repMap.set(speciesId, speciesList[0]);
        });

        let compatOrder = [...repMap.keys()].sort(); // sort by speciesId such that compatibility is always considered in the same order
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
                let newSensorColor = randomBlueHue();
                while (PopulationManager.SENSOR_COLORS_USED.has(newSensorColor)) {
                    newSensorColor = randomBlueHue();
                }
                PopulationManager.SENSOR_COLORS_USED.add(newSensorColor);
                PopulationManager.SPECIES_SENSOR_COLORS.set(child.speciesId, newSensorColor);
                PopulationManager.SPECIES_MEMBERS.get(child.speciesId).push(child);
                repMap.set(child.speciesId, child); // child becomes representative for next children
                compatOrder = [...repMap.keys()].sort(); // resort the compatibility ordering

                if (params.SPLIT_SPECIES) {
                    this.initNewWorld(child.speciesId);
                    this.spawnFood(child.speciesId, params.FOOD_AGENT_RATIO);
                }
            }
            this.worlds.get(params.SPLIT_SPECIES ? child.speciesId : 0).agents.push(child);
        });
    };

    countDeads(worldId = undefined) {
        let count = 0;
        (worldId === undefined ? this.agentsAsList() : this.worlds.get(worldId).agents).forEach(agent => {
            if (agent.removeFromWorld) {
                count++;
            }
        });
        return count;
    };

    countAlives(worldId = undefined) {
        let count = 0;
        (worldId === undefined ? this.agentsAsList() : this.worlds.get(worldId).agents).forEach(agent => {
            if (!(agent.removeFromWorld)) {
                count++;
            }
        });
        return count;
    };

    agentsAsList() {
        let agents = [];
        this.worlds.forEach(members => {
            members.agents.forEach(agent => {
                agents.push(agent);
            });
        });
        return agents;
    };

    foodAsList() {
        let food = [];
        this.worlds.forEach(members => {
            members.food.forEach(f => {
                food.push(f);
            });
        });
        return food;
    };

    cleanupAgents() {
        let extincts = [];
        this.worlds.forEach((members, worldId) => {
            for (let i = members.agents.length - 1; i >= 0; --i) {
                if (members.agents[i].removeFromWorld) {
                    members.agents.splice(i, 1);
                }
            }
            if (members.agents.length === 0) {
                extincts.push(worldId);
            }
        });
        if (params.SPLIT_SPECIES) {
            extincts.forEach(speciesId => {
                this.removeWorld(speciesId);
            });
        }
    };

    initNewWorld(worldId) {
        const world = this.createWorldCanvas(worldId);
        this.worlds.set(
            worldId, 
            {
                agents: [], 
                food: [], 
                home: new HomeBase(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2), 
                ctx: world.getContext("2d"),
                canvas: world,
                display: new DataDisplay(this.game)
            }
        );
        this.worlds.get(worldId).home.worldId = worldId;
        this.worlds.get(worldId).display.worldId = worldId;

        if (params.FREE_RANGE) {
            this.resetCanvases();
        }
    };

    createWorldCanvas(worldId) {
        let canvas = document.createElement("canvas");
        canvas.id = `${worldId}`;
        canvas.width = params.CANVAS_SIZE;
        canvas.height = params.CANVAS_SIZE;
        canvas.style.border = "1px solid black";
        return canvas;
    };

    removeWorld(worldId) {
        this.worlds.get(worldId).home.removeFromWorld = true;
        this.worlds.get(worldId).food.forEach(food => food.removeFromWorld = true);
        this.worlds.delete(worldId);
    };

    mergeWorlds() {
        let allAgents = this.agentsAsList();
        let allFood = this.foodAsList();
        allFood.forEach(food => food.worldId = 0); // reset the world id of all food
        this.worlds = new Map();
        let world = this.createWorldCanvas(0);
        this.worlds.set(
            0,
            {
                agents: allAgents,
                food: allFood,
                home: new HomeBase(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2),
                ctx: world.getContext("2d"),
                canvas: world,
                display: new DataDisplay(this.game)
            }
        );
        this.worlds.get(0).home.worldId = 0;
        this.worlds.get(0).display.worldId = 0;
        this.resetCanvases();
    };

    splitWorlds() {
       let allAgents = this.agentsAsList();
       let allFood = this.foodAsList();
       this.worlds = new Map();
       allAgents.forEach(agent => {
            if (this.worlds.get(agent.speciesId) === undefined) {
                this.initNewWorld(agent.speciesId);
            }
            this.worlds.get(agent.speciesId).agents.push(agent);
        });
        let worldIds = [...this.worlds.keys()];
        let index = 0;
        allFood.forEach(f => {
            f.worldId = worldIds[index];
            this.worlds.get(worldIds[index]).food.push(f);
            index = (index + 1) % worldIds.length;
        });
        this.resetCanvases();
    };

    resetCanvases() {
        const tmp = [];
        this.worlds.forEach((val) => {
            tmp.push(val.canvas);
        });
        createSlideShow(tmp, 'canvas');
    };

    processGeneration() {
        this.agentsAsList().forEach(agent => {
            this.agentTracker.processAgent(agent);
            this.genomeTracker.processGenome(agent.genome);
            agent.age++;
            agent.assignFitness();
        });

        Genome.resetInnovations(); // reset the innovation number mapping for newly created connections

        let reprodFitMap = new Map();
        let minShared = 0;
        PopulationManager.SPECIES_MEMBERS.forEach((speciesList, speciesId) => {
            let sumRaws = 0;
            speciesList.forEach(member => {
                sumRaws += member.genome.rawFitness;
            });
            minShared = Math.min(minShared, sumRaws);
            reprodFitMap.set(speciesId, sumRaws / speciesList.length);
        });
        let sumShared = 0;
        reprodFitMap.forEach((fitness, speciesId) => {
            const newFit = fitness + minShared * -1 + 10;
            reprodFitMap.set(speciesId, newFit);
            sumShared += reprodFitMap.get(speciesId);
            this.agentTracker.addSpeciesFitness({speciesId, fitness: newFit});
        });

        if (!params.FREE_RANGE) {
            let rouletteOrder = [...reprodFitMap.keys()].sort();
            let ascendingFitSpecies = [...reprodFitMap.keys()].sort((s1, s2) => reprodFitMap.get(s1) - reprodFitMap.get(s2));
            let deathFitMap = new Map();
            for (let i = 0; i < ascendingFitSpecies.length; i++) {
                deathFitMap.set(ascendingFitSpecies[i], reprodFitMap.get(ascendingFitSpecies[ascendingFitSpecies.length - i - 1]));
            }
    
            let deadCount = this.countDeads(); // this call is if we are transitioning from free range -> generational mode
            let numAgents = this.agentsAsList().length;
            for (let i = 0; i < Math.ceil(numAgents / 2) - deadCount; i++) { // death roulette -> kill the ceiling to ensure agent list is always even
                let killed = false;
                while (!killed) { // keep rolling the roulette wheel until someone dies
                    let rouletteResult = randomFloat(sumShared);
                    let rouletteIndex = 0;
                    let accumulator = 0;
                    let flag = false;
                    while (!flag) {
                        let nextSpecies = rouletteOrder[rouletteIndex];
                        accumulator += deathFitMap.get(nextSpecies);
                        if (accumulator >= rouletteResult) { // we try to kill a parent... might not be successful
                            flag = true;
                            let killOptions = shuffleArray(PopulationManager.SPECIES_MEMBERS.get(nextSpecies));
                            let j = 0;
                            while (j < killOptions.length && !killed) {
                                let toKill = killOptions[j];
                                if (!toKill.removeFromWorld) {
                                    killed = true;
                                    toKill.removeFromWorld = true;
                                }
                                j++;
                            }
                        }
                        rouletteIndex++;
                    }
                } 
            }

            let children = [];
            let alives = this.countAlives(); // if free range mode kills off everybody, we produce at least 1 new agent
            for (let i = 0; i < PopulationManager.MIN_AGENTS - alives; i++) { // randomly produce offspring between n pairs of remaining agents, reproduction roulette
                let rouletteResult = randomFloat(sumShared);
                let rouletteIndex = 0;
                let accumulator = 0;
                let flag = false;
                let parent1, parent2;
                while (!flag) {
                    let nextSpecies = rouletteOrder[rouletteIndex];
                    accumulator += reprodFitMap.get(nextSpecies);
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
            this.registerChildAgents(children);
        }

        this.cleanupAgents(); // unregister killed parents

        let remainingColors = new Set(); // we need to filter out the colors of species that have died out for reuse
        let remainingSensorColors = new Set(); // same thing with sensor colors
        PopulationManager.SPECIES_MEMBERS = new Map();
        this.agentsAsList().forEach(agent => { // fill species members map with surviving parents and children
            if (PopulationManager.SPECIES_MEMBERS.get(agent.speciesId) === undefined) {
                PopulationManager.SPECIES_MEMBERS.set(agent.speciesId, []);
            }
            PopulationManager.SPECIES_MEMBERS.get(agent.speciesId).push(agent);
            remainingColors.add(PopulationManager.SPECIES_COLORS.get(agent.speciesId));
            remainingSensorColors.add(PopulationManager.SPECIES_SENSOR_COLORS.get(agent.speciesId));
        });
        PopulationManager.COLORS_USED = new Set([...PopulationManager.COLORS_USED].filter(color => remainingColors.has(color)));
        PopulationManager.SENSOR_COLORS_USED = new Set([...PopulationManager.SENSOR_COLORS_USED].filter(color => remainingSensorColors.has(color)));

        if (!params.FREE_RANGE) {
            this.agentsAsList().forEach(agent => {
                agent.resetPos();
                agent.resetOrigin();
                agent.resetEnergy();
            });
        }

        PopulationManager.GEN_NUM++;
        generateAgeChart(this.agentTracker.getAgeData());
        generateFoodConsumptionChart(this.foodTracker.getConsumptionData());
        generateFoodStageChart(this.foodTracker.getLifeStageData());
        generateConnectionChart(this.genomeTracker.getConnectionData());
        generateCycleChart(this.genomeTracker.getCycleData());
        generateNodeChart(this.genomeTracker.getNodeData());
        generateCurrentFitnessChart(this.agentTracker.getFitnessData());
        this.foodTracker.addNewGeneration();
        this.agentTracker.addNewGeneration();
        this.genomeTracker.addNewGeneration();
        this.resetCanvases();
    };
};