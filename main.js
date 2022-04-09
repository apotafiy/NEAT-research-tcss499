const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById('gameWorld');
    const ctx = canvas.getContext('2d');

    gameEngine.init(ctx);

    gameEngine.start();

    let home = new HomeBase(gameEngine, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2);
    gameEngine.addEntity(home);
    gameEngine.home = home;

    for (let i = 0; i < 200; i++) { // add food sources
        gameEngine.addEntity(new Food(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1), false));
    }

    for (let i = 0; i < 100; i++) { // add agents
        gameEngine.addEntity(new Agent(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1)));
    }

    let agentA = new Agent(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1));
    let agentB = new Agent(gameEngine, randomInt(params.CANVAS_SIZE + 1), randomInt(params.CANVAS_SIZE + 1));

    Genome.crossover(agentA.neuralNet.genome, agentB.neuralNet.genome);
});
