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

	uiService.renderText({ cssClass: "app-title", width: AppConfig.fieldWidth, height: 25, text: AppConfig.appTitle });
	uiService.renderPlayerStatusBar({ cssClass: "player-status-bar", health: 85, coins: 2000, width: AppConfig.fieldWidth, height: 25 });

	const field = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	uiService.renderGameBoard(field);
})();
