class DataDisplay {

    constructor(game) {
        this.game = game;
    }

    update() {

    };

    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "left";
        ctx.strokeText(`Generation: ${PopulationManager.GEN_NUM}`, 10, 30);
        ctx.strokeText(`Next In: ${params.GEN_TICKS - this.game.population.tickCounter} ticks`, 10, 60);
        ctx.strokeText(`Living Species: ${PopulationManager.SPECIES_MEMBERS.size}`, 10, 90);
        ctx.strokeText(`Total Species: ${PopulationManager.SPECIES_CREATED}`, 10, 120);
        
        ctx.textAlign = "right";
        ctx.strokeText(`Species: ${this.worldId}`, params.CANVAS_SIZE - 10, 30);
        ctx.strokeText(`Agent Count: ${this.game.population.countAlives(this.worldId)}`, params.CANVAS_SIZE - 10, 60);
    };
};