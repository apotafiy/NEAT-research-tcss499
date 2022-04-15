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

    let population = new PopulationManager(gameEngine);

    console.log(Genome.getDefault())
});
