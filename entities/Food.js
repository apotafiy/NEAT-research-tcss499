class Food {
    
    constructor(game, x, y, isPoison) {
        this.x = x;
        this.y = y;
        this.isPoison = isPoison;
        this.game = game;
        this.states = {
            seed: 0,
            adolescent: 1,
            adult: 2,
            decaying: 3,
            dead: 4,
        };
        this.state = this.states.seed;
        this.properties = [
            {
                lifeSpan: 5,
                radius: 3,
                color: 'hsl(110, 100%, 50%)',
                calories: 5,
                isSet: false,
            },
            {
                lifeSpan: 5,
                radius: 6,
                color: 'hsl(110, 100%, 40%)',
                calories: 10,
                isSet: false,
            },
            {
                lifeSpan: 5,
                radius: 9,
                color: 'hsl(110, 100%, 30%)',
                calories: 15,
                isSet: false,
            },
            {
                lifeSpan: 2,
                radius: 9,
                color: 'hsl(110, 100%, 20%)',
                calories: -10,
                isSet: false,
            },
        ]; // the properties of the entity at each state
        // would access as such: this.stateProps[this.state].lifeSpan
        this.updateBoundingCircle();
    }

    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x, this.y, this.properties[this.state].radius);
    }

    consume(){
        this.state = this.states.dead;
        // if isPoison then energy is depleted
        return this.isPoison ? Math.abs(this.properties[this.state].calories) * -1: this.properties[this.state].calories;
    }

    update() {
        if (this.state == this.states.dead) {
            this.removeFromWorld = true;
            return;
        } else if (!this.properties[this.state].isSet) {
            this.properties[this.state].isSet = true;
            setTimeout(() => {
                this.state += 1;
            }, this.properties[this.state].lifeSpan * 1000);
        }
        this.updateBoundingCircle();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.properties[this.state].radius, 0 , 2 * Math.PI, false);
        ctx.fillStyle = this.properties[this.state].color;
        ctx.fill();
        ctx.lineWidth = 2;
        // ctx.strokeStyle = this.properties[this.state].color;
        ctx.strokeStyle = "Black";
        ctx.stroke();
    }
}
