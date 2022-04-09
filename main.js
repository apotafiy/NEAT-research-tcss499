const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById('gameWorld');
    const ctx = canvas.getContext('2d');

    gameEngine.init(ctx);

    gameEngine.start();

    for (let i = 0; i < 200; i++) {
        gameEngine.addEntity(new Food(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1), false));
    }

    for (let i = 0; i < 50; i++) {
        gameEngine.addEntity(new Agent(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1)));
    }

    let agentA = new Agent(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1));
    let agentB = new Agent(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1));

    Genome.crossover(agentA.neuralNet.genome, agentB.neuralNet.genome);
});
