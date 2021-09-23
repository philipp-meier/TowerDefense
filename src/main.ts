import { UIService } from './game/services/UIService.js';
import { Game } from './game/Game.js';

(() => {
	const main = document.getElementById("main");
	const game = new Game();
	const uiService = new UIService(<HTMLDivElement>main, game);

	if (uiService.ensureScreenSizeSupported(true))
		game.start(uiService);
})();
