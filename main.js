const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	gameEngine.start();

	gameEngine.addEntity(new Agent(gameEngine, 100, 100));
	gameEngine.addEntity(new Agent(gameEngine, 200, 200));
	gameEngine.addEntity(new Agent(gameEngine, 300, 300));
	gameEngine.addEntity(new Agent(gameEngine, 400, 400));
	gameEngine.addEntity(new Agent(gameEngine, 500, 500));
});
