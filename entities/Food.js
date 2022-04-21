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
                lifeSpan: 3,
                radius: 3,
                color: 'hsl(50, 100%, 50%)',
                calories: 5,
                isSet: false,
            },
            {
                lifeSpan: 3 + Math.random() * 2, // add a bit of variation in lifespan
                radius: 6,
                color: 'hsl(100, 100%, 50%)',
                calories: 10,
                isSet: false,
            },
            {
                lifeSpan: 3,
                radius: 9,
                color: 'hsl(200, 100%, 50%)',
                calories: 15,
                isSet: false,
            },
            {
                lifeSpan: 3,
                radius: 9,
                color: 'hsl(25, 100%, 50%)',
                calories: -10,
                isSet: false,
            },
        ]; // the properties of the entity at each state
        // would access as such: this.stateProps[this.state].lifeSpan
        this.updateBoundingCircle();
    }

    isAdult() {
        return this.state === this.states.decaying;
    };

    getHue() {
        let commaIndex = this.properties[this.state].color.indexOf(",");
        return parseFloat(this.properties[this.state].color.substring(4, commaIndex));
    };

    updateBoundingCircle() {
        this.BC = new BoundingCircle(
            this.x,
            this.y,
            this.properties[this.state].radius
        );
    }

    consume() {
        // if isPoison then energy is depleted
        let cals = this.isPoison
            ? Math.abs(this.properties[this.state].calories) * -1
            : this.properties[this.state].calories;
        this.state = this.states.dead;
        this.removeFromWorld = true;
        return cals;
    }

    reproduce() {
        const maxChildCount = 3;
        let numChildren = Math.floor(Math.random() * maxChildCount) + 1;
        // determine a circle around food where it reproduce
        // use the number of children to determine the angle to place the children
        // if number of children is 2 then the angle increments should be 180deg
        // if its 4 then it should be 90deg incrememnts
        // once we know the angle we can choose a random distance from center to place the food
        const increment = (2 * Math.PI) / numChildren;
        let angle = Math.random() * Math.PI; // choose random starting angle to provide some variation in placements
        const maxDist = 200;
        let children = [];
        for (let i = 0; i < numChildren; i++) {
            // if i know angle and distance then i know coordinates
            const distance = Math.random() * maxDist;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            let seedling = new Food(this.game, this.x + x, this.y + y, false);
            children.push(seedling);
            angle += increment;
        }
        return children;
    }

    update() {
        if(this.x < 0 || this.y < 0 || this.x > document.getElementById("gameWorld").width || this.y > document.getElementById("gameWorld").height){
            // I include this in case the food spawns outside the bounds of the canvas
            // that way it does not needlessly render these entities
            this.removeFromWorld = true;
            return;
        }
        if (this.state == this.states.dead) {
            this.removeFromWorld = true;
            return;
        } else if (!this.properties[this.state].isSet) {
            this.properties[this.state].isSet = true;
            setTimeout(() => {
                this.state += 1;
                if (this.state == this.states.dead) {
                    this.removeFromWorld = true;
                }
            }, this.properties[this.state].lifeSpan * 1000);
        }
        this.updateBoundingCircle();
    }

    draw(ctx) {
        if(this.state == this.states.dead){
            return;
        }
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
        ctx.strokeStyle = 'Black';
        ctx.stroke();
    }
}
