const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById('gameWorld');
    const ctx = canvas.getContext('2d');

    gameEngine.init(ctx);

    gameEngine.start();
    gameEngine.addEntity(new Food(gameEngine, 50, 50, false));

    gameEngine.addEntity(new Agent(gameEngine, 500, 500));
});
