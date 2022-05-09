// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

        // Everything that will be updated and drawn each frame
        this.entities = [];

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
        // this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, document.body.children[0]);
        };
        gameLoop();
    };

    // startInput() {
    //     const getXandY = e => ({
    //         x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
    //         y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
    //     });
        
    //     this.ctx.canvas.addEventListener("mousemove", e => {
    //         if (this.options.debugging) {
    //             console.log("MOUSE_MOVE", getXandY(e));
    //         }
    //         this.mouse = getXandY(e);
    //     });

    //     this.ctx.canvas.addEventListener("click", e => {
    //         if (this.options.debugging) {
    //             console.log("CLICK", getXandY(e));
    //         }
    //         this.click = getXandY(e);
    //     });

    //     this.ctx.canvas.addEventListener("wheel", e => {
    //         if (this.options.debugging) {
    //             console.log("WHEEL", getXandY(e), e.wheelDelta);
    //         }
    //         e.preventDefault(); // Prevent Scrolling
    //         this.wheel = e;
    //     });

    //     this.ctx.canvas.addEventListener("contextmenu", e => {
    //         if (this.options.debugging) {
    //             console.log("RIGHT_CLICK", getXandY(e));
    //         }
    //         e.preventDefault(); // Prevent Context Menu
    //         this.rightclick = getXandY(e);
    //     });

    //     this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
    //     this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    // };

    addEntity(entity) {
        if (entity instanceof Agent || entity instanceof HomeBase) {
            this.entities.push(entity);
        } else {
            this.entities.splice(1, 0, entity);
            this.iShift++;
        }
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))

        this.population.worlds.forEach((members, worldId) => {
            members.ctx.clearRect(0, 0, params.CANVAS_SIZE, params.CANVAS_SIZE);
        });

        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            let ctx = this.population.worlds.get(entity instanceof Agent ? entity.speciesId : entity.worldId).ctx;
            entity.draw(ctx, this);
        }

        this.population.worlds.forEach((members, worldId) => {
            this.display.draw(members.ctx, this);
        });
    };

    update() {
        this.iShift = 0;
        let entitiesCount = this.entities.length;
        let flag = this.population.update();

        for (let i = this.iShift; i < this.iShift + entitiesCount; i++) {
            let entity = this.entities[i];
            
            let prevShift = this.iShift;
            if (!entity.removeFromWorld) {
                entity.update();
                i += this.iShift - prevShift;
            }
        }

        if (flag && params.FOOD_PERIODIC_REPOP) {
            this.population.checkFoodLevels();
        }

        for (let i = entitiesCount + this.iShift - 1; i >= this.iShift; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
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