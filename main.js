const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {

    let population = new PopulationManager(gameEngine);
    gameEngine.population = population;

    gameEngine.display = new DataDisplay(gameEngine);

    gameEngine.init();

    gameEngine.start();
});
