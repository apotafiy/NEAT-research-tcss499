class DataDisplay {

    constructor(game) {
        this.game = game;
    }

    update() {

    };

    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.font = "20px sans-serif";
        ctx.strokeText(`Generation: ${PopulationManager.GEN_NUM}`, 10, 30);
        ctx.strokeText(`Next In: ${params.GEN_TICKS - this.game.population.tickCounter} ticks`, 10, 60);
        ctx.strokeText(`Living Species: ${PopulationManager.SPECIES_MEMBERS.size}`, 10, 90);
        ctx.strokeText(`Total Species: ${PopulationManager.SPECIES_CREATED}`, 10, 120);
        ctx.strokeText(`Agent Count: ${this.game.population.countAlives()}`, 10, 150);
    };
};