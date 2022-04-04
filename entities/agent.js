class Agent {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.diameter = 30;
        this.wheelRadius = 5;
        this.maxVelocity = 1;
        this.strokeColor = "black";    
        this.fillColor = "blue";
        this.leftWheel = 0;
        this.rightWheel = 0;
        this.heading = randomInt(361) * Math.PI / 180;
        this.neuralNet = new NeuralNet();
        this.updateBoundingCircle();
    };

    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x + this.diameter / 2, this.y + this.diameter / 2, this.diameter / 2);
    };

    update() {
        this.leftWheel = parseFloat(document.getElementById("leftwheel").value);
        this.rightWheel = parseFloat(document.getElementById("rightwheel").value);

        let dh = this.wheelRadius / this.diameter * this.maxVelocity * (this.rightWheel - this.leftWheel);   
        let dx = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.cos(this.heading);
        let dy = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.sin(this.heading);
        this.x += dx;
        this.y += dy;
        this.heading += dh;

        this.neuralNet.processInput([0.5]);

        this.updateBoundingCircle();
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x + this.diameter / 2, this.y + this.diameter / 2, this.diameter / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.BC.center.x, this.BC.center.y);
        ctx.lineTo(this.BC.center.x + 30 * Math.cos(this.heading), this.BC.center.y + 30 * Math.sin(this.heading));
        ctx.stroke();
    };
};