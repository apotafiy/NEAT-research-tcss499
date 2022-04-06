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
                radius: 5,
                color: 'hsl(110, 100%, 50%)',
                calories: 5,
                isSet: false,
            },
            {
                lifeSpan: 5 + Math.random(), // add a bit of variation in lifespan 
                radius: 10,
                color: 'hsl(110, 100%, 40%)',
                calories: 10,
                isSet: false,
            },
            {
                lifeSpan: 5, 
                radius: 15,
                color: 'hsl(110, 100%, 30%)',
                calories: 15,
                isSet: false,
            },
            {
                lifeSpan: 2,
                radius: 15,
                color: 'hsl(110, 100%, 20%)',
                calories: -10,
                isSet: false,
            },
        ]; // the properties of the entity at each state
        // would access as such: this.stateProps[this.state].lifeSpan
        this.updateBoundingCircle();
    }

    updateBoundingCircle() {
        this.BC = new BoundingCircle(
            this.x,
            this.y,
            this.properties[this.state].radius
        );
    }

    consume() {
        this.state = this.states.dead;
        // if isPoison then energy is depleted
        return this.isPoison
            ? Math.abs(this.properties[this.state].calories) * -1
            : this.properties[this.state].calories;
    }

    reproduce(numChildren) {
        // determine a circle around food where it reproduce
        // use the number of children to determine the angle to place the children
        // if number of children is 2 then the angle increments should be 180deg
        // if its 4 then it should be 90deg incrememnts
        // once we know the angle we can choose a random distance from center to place the food
        const increment = 2 * Math.PI / numChildren;
        let angle = Math.random() * Math.PI; // choose random starting angle to provide some variation in placements
        const maxDist = 200;
        for(let i = 0 ; i < numChildren ; i++){
            // if i know angle and distance then i know coordinates
            const distance = Math.random() * maxDist;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            this.game.entities.push(new Food(this.game, this.x + x, this.y + y, false));
            angle+=increment;
        }
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
            if (this.state == this.states.adult) {
                const maxChildCount = 3;
                this.reproduce(Math.floor(Math.random() * (maxChildCount)) + 1);
            }
        }
        this.updateBoundingCircle();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.properties[this.state].radius,
            0,
            2 * Math.PI,
            false
        );
        ctx.fillStyle = this.properties[this.state].color;
        ctx.fill();
        ctx.lineWidth = 2;
        // ctx.strokeStyle = this.properties[this.state].color;
        ctx.strokeStyle = "Black";
        ctx.stroke();
    }
}
