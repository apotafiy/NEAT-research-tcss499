class Food {
    constructor(game, x, y, isPoison) {
        this.x = x;
        this.y = y;
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
                radius: 1,
                color: 'hsl(110, 100%, 50%)',
                calories: 5,
                isSet: false,
            },
            {
                lifeSpan: 5,
                radius: 2,
                color: 'hsl(110, 100%, 40%)',
                calories: 10,
                isSet: false,
            },
            {
                lifeSpan: 10,
                radius: 3,
                color: 'hsl(110, 100%, 30%)',
                calories: 15,
                isSet: false,
            },
            {
                lifeSpan: 2,
                radius: 2,
                color: 'hsl(110, 100%, 20%)',
                calories: -10,
                isSet: false,
            },
        ]; // the properties of the entity at each state
        // would access as such: this.stateProps[this.state].lifeSpan
    }

    consume(){
        this.state = this.states.dead;
        // if isPoison then energy is depleted
        return this.isPoison ? Math.abs(this.properties[this.state].calories) * -1: this.properties[this.state].calories;
    }

    update() {
        if (this.state == this.states.dead) {
            this.removeFromWorld = true;
        } else if (!this.properties[this.state].isSet) {
            this.properties[this.state].isSet = true;
            setTimeout(() => {
                this.state += 1;
            }, this.properties[this.state].lifeSpan * 1000);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.properties[this.state].radius, 0 , 2 * Math.PI, false);
        ctx.fillStyle = this.properties[this.state].color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.properties[this.state].color;
        ctx.stroke();
    }
}
