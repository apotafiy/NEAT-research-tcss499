// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init() {
        this.startInput();
        this.timer = new Timer();
    };

    startInput() {
        document.getElementById("restart_sim").addEventListener("click", () => this.population.resetSim());
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, document.body.children[0]);
        };
        gameLoop();
    };

    draw() {
        this.population.worlds.forEach(members => {
            members.ctx.clearRect(0, 0, params.CANVAS_SIZE, params.CANVAS_SIZE);
            members.home.draw(members.ctx);
            members.food.forEach(food => {
                if (!food.removeFromWorld) {
                    food.draw(members.ctx)
                }
            });
            members.poison.forEach(poison => {
                if (!poison.removeFromWorld) {
                    poison.draw(members.ctx)
                }
            });
            members.agents.forEach(agent => {
                if (!agent.removeFromWorld) {
                    agent.draw(members.ctx)
                }
            });
            members.display.draw(members.ctx);
        });
    };

    update() {
        let foodCounts = new Map();
        let poisonCounts = new Map();
        let agentCounts = new Map();
        
        this.population.worlds.forEach((members, worldId) => {
            foodCounts.set(worldId, members.food.length);
            poisonCounts.set(worldId, members.poison.length);
            agentCounts.set(worldId, members.agents.length);
        });

        this.population.worlds.forEach((members, worldId) => {
            for (let i = 0; i < foodCounts.get(worldId); i++) {
                if (!members.food[i].removeFromWorld) {
                    members.food[i].update();
                }
            }
            for (let i = 0; i < poisonCounts.get(worldId); i++) {
                if (!members.poison[i].removeFromWorld) {
                    members.poison[i].update();
                }
            }
            for (let i = 0; i < agentCounts.get(worldId); i++) {
                if (!members.agents[i].removeFromWorld) {
                    members.agents[i].update();
                }
            }
        });

        let isNewGeneration = this.population.update();

        if (isNewGeneration) {
            this.population.redistributeFoodAndPoison();

            if (params.FOOD_PERIODIC_REPOP) {
                this.population.checkFoodLevels(false);
            }

            if (params.POISON_PERIODIC_REPOP) {
                this.population.checkFoodLevels(true);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)
// and Artem Potafiy