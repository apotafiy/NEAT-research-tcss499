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

        ctx.textAlign = "center";
        if (params.SPLIT_SPECIES) {
            ctx.strokeText(`Species: ${this.worldId}`, params.CANVAS_SIZE / 2, 30);
            ctx.strokeText(`Agent Count: ${this.game.population.countAlives(this.worldId)}`, params.CANVAS_SIZE / 2, 60);
        } else {
            ctx.strokeText(`Agent Count: ${this.game.population.countAlives(0)}`, params.CANVAS_SIZE / 2, 30);
        }
        
        ctx.textAlign = "right";
        ctx.strokeText(`Living Species: ${PopulationManager.SPECIES_MEMBERS.size}`, params.CANVAS_SIZE - 10, 30);
        ctx.strokeText(`Total Species: ${PopulationManager.SPECIES_CREATED}`, params.CANVAS_SIZE - 10, 60);       
    };
};