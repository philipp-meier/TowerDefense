import { GameBoard } from './classes/GameBoard.js';
import { UIService } from './services/UIService.js';
import { AppConfig, AppService } from './services/AppService.js';
import { Player } from './classes/Player.js';
import { Game } from './classes/Game.js';

(() => {
	const main = document.getElementById("main");
	const player = new Player();
	const game = new Game(player);
	const uiService = new UIService(<HTMLDivElement>main, game);

	if (!AppService.isSupportedScreenSize()) {
		uiService.showMessage(`Resolution not supported! (Min.: ${AppConfig.fieldWidth}x${AppConfig.fieldHeight})`);
		return;
	}

	uiService.renderText({ cssClass: "appTitle", x: 0, y: 0, width: AppConfig.fieldWidth, height: 25, text: AppConfig.appTitle });

	const field = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	uiService.renderGameBoard(field);
})();
