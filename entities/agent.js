class Agent {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.diameter = 20;
        this.wheelRadius = 2.5;
        this.maxVelocity = 2;
        this.strokeColor = "black";    
        this.fillColor = "blue";
        this.leftWheel = 0;
        this.rightWheel = 0;
        this.heading = randomInt(361) * Math.PI / 180;
        this.neuralNet = new NeuralNet();
        this.energy = 0;
        this.updateBoundingCircle();
    };

    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x, this.y, this.diameter / 2);
    };

    update() {
        // this.leftWheel = parseFloat(document.getElementById("leftwheel").value);
        // this.rightWheel = parseFloat(document.getElementById("rightwheel").value);

        let wheels = this.neuralNet.processInput([randomInt(101) / 100, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        this.leftWheel = wheels[0];
        this.rightWheel = wheels[1];

        let dh = this.wheelRadius / this.diameter * this.maxVelocity * (this.rightWheel - this.leftWheel);   
        let dx = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.cos(this.heading);
        let dy = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.sin(this.heading);
        this.x += dx;
        this.y += dy;
        this.heading += dh;

        this.game.entities.forEach(entity => {
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