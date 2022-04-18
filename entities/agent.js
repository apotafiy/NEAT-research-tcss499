class Agent {

    constructor(game, x, y, genome = undefined) {
        Object.assign(this, {game, x, y});
        this.diameter = 20;
        this.wheelRadius = 2.5;
        this.maxVelocity = 1;
        this.visionRadius = 250;
        this.strokeColor = "black";    
        this.fillColor = "hsl(240, 100%, 50%)";
        this.leftWheel = 0;
        this.rightWheel = 0;
        this.heading = randomInt(361) * Math.PI / 180;
        this.genome = genome === undefined ? new Genome() : genome;
        this.neuralNet = new NeuralNet(this.genome);
        this.energy = 0;
        this.resetOrigin();
        this.updateBoundingCircle();
    };

    assignFitness() {
        const fitnessFunct = () => {
            let currentPos = { x: this.x, y: this.y };
            return distance(this.origin, currentPos) - 10 * distance(this.game.home.BC.center, currentPos);
        };

        this.genome.rawFitness = fitnessFunct();
    };

    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x, this.y, this.diameter / 2);
    };

    getHue() {
        let commaIndex = this.fillColor.indexOf(",");
        return parseFloat(this.fillColor.substring(4, commaIndex));
    };

    resetOrigin() {
        this.origin = { x: this.x, y: this.y };
    };

    update() {

        let oldPos = { x: this.x, y: this.y };

        let spottedNeighbors = [];
        this.game.entities.forEach(entity => {
            if (entity !== this && !entity.removeFromWorld && distance(entity.BC.center, this.BC.center) <= this.visionRadius) {
                spottedNeighbors.push(entity);
            }
        });

        spottedNeighbors.sort((entity1, entity2) => distance(entity1.BC.center, this.BC.center) - distance(entity2.BC.center, this.BC.center));
        let input = [];
        for (let i = 0; i < Math.min(spottedNeighbors.length, 5); i++) {
            let neighbor = spottedNeighbors[i];
            input.push(normalizeHue(neighbor.getHue()));
            input.push(normalizeDistance(distance(neighbor.BC.center, this.BC.center)));
        }
        for (let i = input.length; i < 10; i++) {
            input.push(0);
        }

        // this.leftWheel = parseFloat(document.getElementById("leftwheel").value);
        // this.rightWheel = parseFloat(document.getElementById("rightwheel").value);

        let wheels = this.neuralNet.processInput(input);
        this.leftWheel = wheels[0];
        this.rightWheel = wheels[1];

        let dh = this.wheelRadius / this.diameter * this.maxVelocity * (this.rightWheel - this.leftWheel);   
        let dx = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.cos(this.heading);
        let dy = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.sin(this.heading);
        this.x += dx;
        this.y += dy;
        this.heading += dh;

        let displacement = distance(oldPos, { x: this.x, y: this.y });
        this.energy -= displacement;

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
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.BC.center.x + this.diameter / 2 * Math.cos(this.heading), this.BC.center.y + this.diameter / 2 * Math.sin(this.heading));
        ctx.lineTo(this.BC.center.x + this.diameter * Math.cos(this.heading), this.BC.center.y + this.diameter * Math.sin(this.heading));
        ctx.stroke();
    };
};