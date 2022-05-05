class Food {
    constructor(game, x, y, isPoison, foodTracker) {
        this.x = x;
        this.y = y;
        this.isPoison = isPoison;
        this.game = game;
        this.foodTracker = foodTracker;
        this.tickCounter = 0;
        this.lifetimeTicks = params.RAND_FOOD_LIFETIME ? randomInt(params.GEN_TICKS / 2 + 1) + params.GEN_TICKS / 2 : params.GEN_TICKS;
        this.states = {
            seed: 0,
            adolescent: 1,
            adult: 2,
            decaying: 3,
            dead: 4,
        };
        this.state = this.states.seed;
        let lifespans = this.createLifetimes();
        this.properties = [
            {
                lifeSpan: lifespans[0],
                radius: 3,
                color: 'hsl(285, 100%, 50%)',
                calories: 50,
                isSet: false,
            },
            {
                lifeSpan: lifespans[1],
                radius: 6,
                color: 'hsl(300, 100%, 50%)',
                calories: 100,
                isSet: false,
            },
            {
                lifeSpan: lifespans[2],
                radius: 9,
                color: 'hsl(315, 100%, 50%)',
                calories: 150,
                isSet: false,
            },
            {
                lifeSpan: lifespans[3],
                radius: 9,
                color: 'hsl(60, 100%, 50%)',
                calories: -100,
                isSet: false,
            },
        ]; // the properties of the entity at each state
        // would access as such: this.stateProps[this.state].lifeSpan
        this.ticksToNext = this.properties[this.states.seed].lifeSpan;
        this.updateBoundingCircle();
    }

    createLifetimes() {
        const minDistribution = 0.1;
        let total = 0;
        let lifetimes = [];
        if (!params.RAND_FOOD_PHASES) { // not randomized
            for (let i = 0; i < 3; i++) {
                lifetimes.push(Math.floor(0.25 * this.lifetimeTicks));
                total += Math.floor(0.25 * this.lifetimeTicks);
            }
        } else { // randomized
            for (let i = 0; i < 3; i++) {
                let minimum = Math.floor(minDistribution * this.lifetimeTicks);
                let next = Math.floor(Math.max(minimum, Math.random() * (((this.lifetimeTicks - total) / this.lifetimeTicks) - minDistribution * (3 - i)) * this.lifetimeTicks));
                lifetimes.push(next);
                total += next;
            }
        }

        lifetimes.push(this.lifetimeTicks - total);
        return lifetimes;
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
        this.foodTracker.addCalories(cals);
        this.foodTracker.addLifeStage(this.state);
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
        const maxDist = 250;
        let children = [];
        for (let i = 0; i < numChildren; i++) {
            // if i know angle and distance then i know coordinates
            const distance = Math.random() * maxDist;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            let seedling = new Food(this.game, this.x + x, this.y + y, false, this.foodTracker);
            children.push(seedling);
            angle += increment;
        }
        this.game.population.registerSeedlings(children);
    }

    update() {
        if ((this.x < 0 || this.y < 0 || this.x > params.CANVAS_SIZE || this.y > params.CANVAS_SIZE) ||
            (!(params.FOOD_OUTSIDE) && distance(this.BC.center, this.game.home.BC.center) > params.CANVAS_SIZE / 2)){
            // I include this in case the food spawns outside the bounds of the canvas
            // that way it does not needlessly render these entities
            this.removeFromWorld = true;
            return;
        }

        if (!this.properties[this.state].isSet) {
            this.properties[this.state].isSet = true;
        }

        this.tickCounter++;
        if (this.tickCounter === this.ticksToNext) {
            this.tickCounter = 0;
            this.state++;
            if (this.state === this.states.dead) {
                this.removeFromWorld = true;
                this.reproduce();
            } else {
                this.ticksToNext = this.properties[this.state].lifeSpan;
            }
        }

        if (!this.removeFromWorld) {
            this.updateBoundingCircle();
        }
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
