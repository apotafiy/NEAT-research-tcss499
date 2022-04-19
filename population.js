class PopulationManager {

    static MIN_FOOD = 100;
    static MAX_FOOD = 200;

    constructor(game) {
        this.game = game;
        this.agents = [];
        this.food = [];
        this.spawnAgents();
        // this.spawnFood();
        this.startGeneration();
        // this.reproduceFood();
    };

    startGeneration() {
        setTimeout(() => this.processGeneration(), 20000);
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
        for (let i = 0; i < 100; i++) { // add agents
            let agent = new Agent(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2);
            this.game.addEntity(agent);
            this.agents.push(agent);
        }
    };

    spawnFood(count = PopulationManager.MAX_FOOD) {
        for (let i = 0; i < count; i++) { // add food sources
            let food = new Food(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1), false);
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

        let length = this.agents.length;
        for (let i = 0; i < length; i++) { // randomly produce offspring between n pairs of remaining agents
            let parent1 = this.agents[randomInt(this.agents.length)];
            let parent2 = this.agents[randomInt(this.agents.length)];
            let childGenome = Genome.crossover(parent1.genome, parent2.genome);
            childGenome.mutate();
            let child = new Agent(this.game, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2, childGenome);
            this.game.addEntity(child);
            this.agents.push(child);
        }

        this.agents.forEach(agent => {
            agent.resetOrigin();
            agent.resetEnergy();
        });

        this.startGeneration();
    };
};