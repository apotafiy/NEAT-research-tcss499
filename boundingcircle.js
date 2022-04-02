class BoundingCircle {

    constructor(centerX, centerY, radius) {
        this.radius = radius;
        this.center = {x: centerX, y: centerY};
    };

    collide(other) {
        return distance(this.center, other.center) < this.radius + other.radius;
    };
};