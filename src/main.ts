import { UIService } from './game/services/UIService.js';
import { Game } from './game/Game.js';
import '../styles/main.less'

(() => {
	const main = document.getElementById("main");
	const game = new Game();
	const uiService = new UIService(<HTMLDivElement>main, game);

	if (uiService.ensureScreenSizeSupported(true))
		game.start(uiService);
})();
