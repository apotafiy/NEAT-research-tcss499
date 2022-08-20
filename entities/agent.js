/**
 * The main class for Agents and Agent behavior
 * 
 * @author Parker Rosengreen
 */
class Agent {

    /** The amount of energy at which an Agent will die */
    static DEATH_ENERGY_THRESH = 0;

    /** The amount of energy an Agent is given upon spawn */
    static START_ENERGY = 100;

    /**
     * 
     * @param {*} game the game engine
     * @param {*} x the starting centered x position
     * @param {*} y the starting centered y position
     * @param {*} genome the Agent's genome (defaults to undefined if Agent is not an offspring of parent Agents)
     */
    constructor(game, x, y, genome = undefined) {
        Object.assign(this, {game, x, y});
        this.strokeColor = "black"; // the color of the Agent's circular outlining
        this.leftWheel = 0; // the "power" supplied to the Agent's left wheel (falls in the range -1 to 1 inclusive)
        this.rightWheel = 0; // the "power" supplied to the Agent's right wheel (falls in the range -1 to 1 inclusive)
        this.heading = randomInt(361) * Math.PI / 180; // the angle at which an Agent is traveling (fall between 0 to 2pi exclusive)
        this.genome = genome === undefined ? new Genome() : genome; // create a new Genome if none is supplied, otherwise perform an assignment
        this.neuralNet = new NeuralNet(this.genome); // create a new neural network corresponding to the previously assigned Genome
        this.resetEnergy(); // set the Agent's energy to the statically defined start energy
        this.updateDiameter(); // how wide the agent's circle is drawn
        this.wheelRadius = 1; // an agent is more or less structured like a Roomba vacuum robot, and this is the radius of one of its 2 wheels
        this.maxVelocity = 5; // a UNITLESS value which controls the movement speed of Agents in the sim
        this.resetCalorieCounts(); // resets the Agent's good and bad calories eaten
        this.age = 0; // all Agents start at age 0
        this.resetOrigin(); // assigns this Agent's origin point to its current position
        this.updateBoundingCircle(); // initialize the bounding circle
    };

    /** Assigns this Agent's fitness */
    assignFitness() {

        /**
         * Defines the fitness of an Agent using constant parameters inputted by the sim user
         * 
         * @returns this Agent's fitness
         */
        const fitnessFunct = () => {
            return this.energy * params.FITNESS_ENERGY + this.caloriesEaten * params.FITNESS_CALORIES + this.badCaloriesEaten * params.FITNESS_BAD_CALORIES;
        };

        this.genome.rawFitness = fitnessFunct();
    };

    /** Updates this Agent's bounding circle to reflect its current position */
    updateBoundingCircle() {
        this.BC = new BoundingCircle(this.x, this.y, this.diameter / 2);
    };

    /**
     * Supplies this Agent's data hue that is visible by other Agent's in the sim
     * 
     * @returns this Agent's data hue
     */
    getDataHue() {
        return PopulationManager.SPECIES_SENSOR_COLORS.get(this.speciesId);
    };

    /**
     * Suppplies this Agent's visual hue that is used solely for visual distinction in the sim display.
     * This value is NOT used by Agents as input!
     * 
     * @returns this Agent's display hue
     */
    getDisplayHue() {
        return PopulationManager.SPECIES_COLORS.get(this.speciesId);
    };

    /** Updates this Agent's origin (initial position) to its current position in the sim */
    resetOrigin() {
        this.origin = { x: this.x, y: this.y };
    };

    /** Moves this Agent to the center of its world (the middle of the canvas) */
    moveToWorldCenter() {
        this.x = params.CANVAS_SIZE / 2;
        this.y = params.CANVAS_SIZE / 2;
    };

    /**  Resets this Agent's energy to the predefined starting energy for Agents */
    resetEnergy() {
        this.energy = Agent.START_ENERGY;
    };

    /** Resets the good and bad calories eaten by this Agent to 0 */
    resetCalorieCounts() {
        this.caloriesEaten = 0;
        this.badCaloriesEaten = 0;
    };

    /**
     * Indicates whether this Agent is within the boundaries of its world (is visible on the canvas)
     * 
     * @returns true if within the world bounds, false otherwise
     */
    isInWorld() {
        return this.x >= 0 && this.x < params.CANVAS_SIZE && this.y >= 0 && this.y < params.CANVAS_SIZE;
    };

    /**
     * Function used for getting the relative angle between an Agent and a neighboring entity.
     * The relative position angle is always between 0 and pi inclusive, so the mininum of
     * the left and right relative angles is always returned. Relative left angles
     * fall between -pi and 0 inclusive, while relative right angles fall between 0 and pi inclusive.
     * 
     * @param {*} vector 
     * @returns 
     */
    getRelativePositionAngle(vector) {
        let vectAngle = Math.atan2(vector.y, vector.x);
        if (vectAngle < 0) {
            vectAngle = 2 * Math.PI + vectAngle; // convert to a clock wise angle 0 <= a < 2pi
        }
        let relLeft = AgentInputUtil.relativeLeft(this.heading, vectAngle);
        let relRight = AgentInputUtil.relativeRight(this.heading, vectAngle);
        return Math.abs(relLeft) < Math.abs(relRight) ? relLeft : relRight;
    };

    /** Updates this Agent for the current tick */
    update() {
        let oldPos = { x: this.x, y: this.y }; // note where we are before moving

        let spottedNeighbors = [];

        /**
         * if we have split species on, then we only get entities in the world corresponding to our species id, otherwise all entities
         * are guaranteed to be in world 0. If AGENT_NEIGHBORS is off, then we only retrieve food
         */
        let entities = this.game.population.getEntitiesInWorld(params.SPLIT_SPECIES ? this.speciesId : 0, !params.AGENT_NEIGHBORS);
        entities.forEach(entity => {
            /** add all entities to our spotted neighbors that aren't ourselves, not dead, and are within our vision radius */
            if (entity !== this && !entity.removeFromWorld && distance(entity.BC.center, this.BC.center) <= params.AGENT_VISION_RADIUS) {
                spottedNeighbors.push(entity);
            }
        });

        /** sorts the spotted neighbors in increasing order of proxomity */
        spottedNeighbors.sort((entity1, entity2) => distance(entity1.BC.center, this.BC.center) - distance(entity2.BC.center, this.BC.center));
        let input = []; // the input to the neural network

        input.push(1); // bias node always = 1

        // add input for the neighbors we have spotted, up to AGENT_NEIGHBOR_COUNT
        for (let i = 0; i < Math.min(spottedNeighbors.length, params.AGENT_NEIGHBOR_COUNT); i++) { 
            let neighbor = spottedNeighbors[i];
            input.push(AgentInputUtil.normalizeHue(neighbor.getDataHue())); // the data hue
            input.push(AgentInputUtil.normalizeAngle(this.getRelativePositionAngle({ x: neighbor.x - this.x, y: neighbor.y - this.y }))); // normalized relative position angle
            input.push(AgentInputUtil.normalizeDistance(distance(neighbor.BC.center, this.BC.center))); // normalized distance from the entity
        }
        for (let i = input.length; i < Genome.DEFAULT_INPUTS; i++) { // fill all unused input nodes with 0's
            input.push(0);
        }

        if (this.energy <= Agent.DEATH_ENERGY_THRESH) { // if we are dead, we don't move
            this.leftWheel = 0;
            this.rightWheel = 0;
        } else { // if we are still alive, set our wheel power values to the output of our neural net
            let wheels = this.neuralNet.processInput(input);
            this.leftWheel = wheels[0];
            this.rightWheel = wheels[1];
        }

        /** This is the physics behind how our wheel's power values affect our position and heading */
        let dh = this.wheelRadius / this.diameter * this.maxVelocity * (this.rightWheel - this.leftWheel);   
        let dx = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.cos(this.heading);
        let dy = (this.wheelRadius / 2) * this.maxVelocity * (this.rightWheel + this.leftWheel) * Math.sin(this.heading);
        this.x += dx;
        this.y += dy;
        this.heading += dh;

        /** Make sure our new heading is between 0 and 2pi exclusive */
        if (this.heading < 0) {
            this.heading += 2 * Math.PI;
        } else if (this.heading >= 2 * Math.PI) {
            this.heading -= 2 * Math.PI;
        }

        // this code defines Agent metabolism as a function of the Agent's diameter and displacement (how far we have moved since the last tick)
        let displacement = distance(oldPos, { x: this.x, y: this.y });
        this.energy -= (this.diameter / 20) * (displacement / 10) / 2;
        this.energy -= 0.1; // this is a baseline metabolism that is independent of Agent physical activity

        /** Update our diameter and BC to reflect our current position */
        this.updateDiameter();
        this.updateBoundingCircle();

        /** If we are still alive, loop through spotted food and eat those we are colliding with */
        if (this.energy > Agent.DEATH_ENERGY_THRESH) {
            spottedNeighbors.forEach(entity => {
                if (entity instanceof Food && this.BC.collide(entity.BC)) {
                    let cals = entity.consume();
                    if (cals < 0) {
                        this.badCaloriesEaten += Math.abs(cals);
                    } else {
                        this.caloriesEaten += cals;
                    }
                    this.energy += cals;
                } 
            });

            /** Our energy may have changed, so update our diameter and BC once again */
            this.updateDiameter();
            this.updateBoundingCircle();
        }



        if (params.FREE_RANGE) { // check for reproduction if in free range mode
            let agents = this.game.population.getEntitiesInWorld(params.SPLIT_SPECIES ? this.speciesId : 0, false, true);
            agents.forEach(entity => {
                /** 
                 * By convention, two Agent parents can only reproduce if they are colliding with one another and are each able to
                 * contribute half of Agent.START_ENERGY to their child.
                 * */
                if (entity !== this && this.energy >= Agent.START_ENERGY / 2 && entity.energy >= Agent.START_ENERGY / 2 && entity.BC.collide(this.BC)) {
                    let childGenome = Genome.crossover(this.genome, entity.genome);
                    childGenome.mutate();
                    let child = new Agent(this.game, this.x, this.y, childGenome);
                    this.energy -= Agent.START_ENERGY / 2;
                    entity.energy -= Agent.START_ENERGY / 2;
                    this.game.population.registerChildAgents([child]); // add the new child to the sim
                }
            });
        }
    };

    /** Updates this Agent's diameter in alignment with the DYNAMIC_AGENT_SIZING sim parameter */
    updateDiameter() {
        const base_diameter = 15;

        if (params.DYNAMIC_AGENT_SIZING) { // Agents are able to grow up to 150% their smallest size in proportion to their energy
            const min_food_cal = 50;
            const max_food_cal = 150;
            let addOn = 0; // the amount we add onto the base diameter

            if (this.energy > Agent.DEATH_ENERGY_THRESH) { // if alive, scale by how well this Agent has eaten its allotted food
                addOn = base_diameter / 2 * Math.min(1, this.energy / (params.FOOD_AGENT_RATIO * max_food_cal));
            }
            this.diameter = base_diameter + addOn;
        } else {
            this.diameter = base_diameter;
        }
    };

    /**
     * Draws this agent on its world canvas
     * 
     * @param {*} ctx the canvas context
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = `hsl(${this.getDisplayHue()}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.BC.center.x + this.diameter / 2 * Math.cos(this.heading), this.BC.center.y + this.diameter / 2 * Math.sin(this.heading));
        ctx.lineTo(this.BC.center.x + this.diameter * Math.cos(this.heading), this.BC.center.y + this.diameter * Math.sin(this.heading));
        ctx.stroke();
    };
};