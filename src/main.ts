import { UIService } from './services/UIService.js';
import { AppConfig, AppService } from './services/AppService.js';
import { Game } from './classes/Game.js';

(() => {
	const main = document.getElementById("main");
	const game = new Game();
	const uiService = new UIService(<HTMLDivElement>main, game);

	if (!AppService.isSupportedScreenSize()) {
		uiService.showMessage(`Resolution not supported! (Min.: ${AppConfig.fieldWidth}x${AppConfig.fieldHeight})`);
		return;
	}

	game.start(uiService);
})();
