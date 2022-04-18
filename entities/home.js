class HomeBase {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.diameter = 30;
        this.strokeColor = "black";    
        this.fillColor = "hsl(0, 0%, 0%)";
        this.updateBoundingCircle();
    };

    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x, this.y, this.diameter / 2);
    };

    getHue() {
        let commaIndex = this.fillColor.indexOf(",");
        return parseFloat(this.fillColor.substring(4, commaIndex));
    };

    update() {};

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    };
};