class Agent {

    constructor(game, x, y, genome = undefined) {
        Object.assign(this, {game, x, y});
        this.diameter = 20;
        this.wheelRadius = 2.5;
        this.maxVelocity = 2;
        this.visionRadius = 500;
        this.strokeColor = "black";
        // this.fillColor = "hsl(240, 100%, 50%)";
        this.leftWheel = 0;
        this.rightWheel = 0;
        this.heading = randomInt(361) * Math.PI / 180;
        this.genome = genome === undefined ? new Genome() : genome;
        this.neuralNet = new NeuralNet(this.genome);
        this.energy = 0;
        this.age = 0;
        this.resetOrigin();
        this.updateBoundingCircle();
    };

    assignFitness() {
        const fitnessFunct = () => {
            let currentPos = { x: this.x, y: this.y };
            // return distance(this.origin, currentPos) - 10 * distance(this.game.home.BC.center, currentPos);
            // return this.energy - 10 * distance(currentPos, this.game.home.BC.center);
            return this.energy;
        };

        this.genome.rawFitness = fitnessFunct();
    };

    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x, this.y, this.diameter / 2);
    };

    getHue() {
        // let commaIndex = this.fillColor.indexOf(",");
        // return parseFloat(this.fillColor.substring(4, commaIndex));
        return PopulationManager.SPECIES_COLORS.get(this.speciesId);
    };

    resetOrigin() {
        this.origin = { x: this.x, y: this.y };
    };

    resetPos() {
        this.x = params.CANVAS_SIZE / 2;
        this.y = params.CANVAS_SIZE / 2;
    };

    resetEnergy() {
        this.energy = 0;
    };

    update() {

        let oldPos = { x: this.x, y: this.y };

        let spottedNeighbors = [];
        this.game.entities.forEach(entity => {
            if (entity !== this && (params.AGENT_NEIGHBORS || !(entity instanceof Agent)) && !entity.removeFromWorld && distance(entity.BC.center, this.BC.center) <= this.visionRadius) {
                spottedNeighbors.push(entity);
            }
        });

        spottedNeighbors.sort((entity1, entity2) => distance(entity1.BC.center, this.BC.center) - distance(entity2.BC.center, this.BC.center));
        let input = [];
        for (let i = 0; i < Math.min(spottedNeighbors.length, 5); i++) {
            let neighbor = spottedNeighbors[i];
            input.push(normalizeHue(neighbor.getHue()));
            let vector = { x: neighbor.x - this.x, y: neighbor.y - this.y };
            let vectAngle = Math.atan2(vector.y, vector.x);
            if (vectAngle < 0) {
                vectAngle += 2 * Math.PI;
            }
            input.push(normalizeAngle((this.heading - vectAngle) * 180 / Math.PI));
            input.push(normalizeDistance(distance(neighbor.BC.center, this.BC.center)));
            // input.push(normalizeAngle(this.heading * 180 / Math.PI));
            // input.push(normalizeX(neighbor.x - this.x));
            // input.push(normalizeY(neighbor.y - this.y));
        }
        for (let i = input.length; i < Genome.DEFAULT_INPUTS; i++) {
            input.push(0);
        }

        let wheels = this.neuralNet.processInput(input);
        this.leftWheel = wheels[0];
        this.rightWheel = wheels[1];

        let dh = this.wheelRadius / this.diameter * this.maxVelocity * (this.rightWheel - this.leftWheel);   
        let dx = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.cos(this.heading);
        let dy = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.sin(this.heading);
        this.x += dx;
        this.y += dy;
        this.heading += dh;

        if (this.heading < 0) {
            this.heading += 2 * Math.PI;
        } else if (this.heading >= 2 * Math.PI) {
            this.heading -= 2 * Math.PI;
        }

        if (this.heading < 0) {
            console.log("uh oh!");
        }

        if (Math.abs(wheels[0]) > 1 || Math.abs(wheels[1]) > 1) {
            console.log("invalid output for a wheel!");
        }

        // uncomment this code to implement agent metabolism
        let displacement = distance(oldPos, { x: this.x, y: this.y });
        this.energy = Math.max(0, this.energy - displacement / 2);

        this.game.entities.forEach(entity => { // eat food
            if (entity instanceof Food && !entity.removeFromWorld && this.BC.collide(entity.BC)) {
                this.energy += entity.consume();
            }
        });

        this.updateBoundingCircle();
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = `hsl(${this.getHue()}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.BC.center.x + this.diameter / 2 * Math.cos(this.heading), this.BC.center.y + this.diameter / 2 * Math.sin(this.heading));
        ctx.lineTo(this.BC.center.x + this.diameter * Math.cos(this.heading), this.BC.center.y + this.diameter * Math.sin(this.heading));
        ctx.stroke();
    };
};