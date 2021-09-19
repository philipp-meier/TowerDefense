import { UIService } from './game/services/UIService.js';
import { AppConfig, AppService } from './game/services/AppService.js';
import { Game } from './game/Game.js';

(() => {
	const main = document.getElementById("main");
	const game = new Game();
	const uiService = new UIService(<HTMLDivElement>main, game);

	if (!AppService.isSupportedScreenSize()) {
		uiService.renderMessage(`Resolution not supported! (Min.: ${AppConfig.fieldWidth}x${AppConfig.fieldHeight})`);
		return;
	}

	game.start(uiService);
})();
