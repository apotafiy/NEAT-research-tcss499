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
        this.updateBoundingCircle();
    };

    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x + this.diameter / 2, this.y + this.diameter / 2, this.diameter / 2);
    };

    update() {
        this.leftWheel = parseFloat(document.getElementById("leftwheel").value);
        this.rightWheel = parseFloat(document.getElementById("rightwheel").value);

        let dh = this.wheelRadius / this.diameter * this.maxVelocity * (this.rightWheel - this.leftWheel);
        // this.heading += dh;

        // console.log(dh)

        
        let dx = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.cos(this.heading);

        if (isNaN(dx)) {
            console.log("dx is NaN!")
        }
        let dy = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.sin(this.heading);
        this.x += dx;
        this.y += dy;
        this.heading += dh;

        // console.log(dx)

        this.updateBoundingCircle();
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x + this.diameter / 2, this.y + this.diameter / 2, this.diameter / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.BC.center.x, this.BC.center.y);
        ctx.lineTo(this.BC.center.x + 50 * Math.cos(this.heading), this.BC.center.y + 50 * Math.sin(this.heading));
        ctx.stroke();
    };
};