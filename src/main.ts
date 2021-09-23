import { UIService } from './game/services/UIService.js';
import { AppService } from './game/services/AppService.js';
import { Game } from './game/Game.js';
import { GameSettings } from './game/GameSettings.js';

(() => {
	const main = document.getElementById("main");
	const game = new Game();
	const uiService = new UIService(<HTMLDivElement>main, game);

	if (!AppService.isSupportedScreenSize()) {
		uiService.renderMessage(`Resolution not supported! (Min.: ${GameSettings.fieldWidth}x${GameSettings.fieldHeight})`);
		return;
	}

	game.start(uiService);
})();
