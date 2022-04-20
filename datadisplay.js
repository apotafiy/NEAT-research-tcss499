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
        ctx.strokeText(`Next In: ${this.game.population.timer.toFixed(1)}`, 10, 60);
        ctx.strokeText(`Living Species: ${PopulationManager.SPECIES_MEMBERS.size}`, 10, 90);
        ctx.strokeText(`Total Species: ${PopulationManager.SPECIES_CREATED}`, 10, 120);
    };
};