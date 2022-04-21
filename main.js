const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById('gameWorld');
    const ctx = canvas.getContext('2d');

    let home = new HomeBase(gameEngine, params.CANVAS_SIZE / 2, params.CANVAS_SIZE / 2);
    gameEngine.addEntity(home);
    gameEngine.home = home;

    let population = new PopulationManager(gameEngine);
    gameEngine.population = population;

    gameEngine.display = new DataDisplay(gameEngine);

    gameEngine.init(ctx);

    gameEngine.start();


});
