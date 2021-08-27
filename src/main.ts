import { GameBoard } from './classes/GameBoard.js';
import { UIService } from './services/UIService.js';
import { AppConfig, AppService } from './services/AppService.js';

(() => {
	const main = document.getElementById("main");
	const uiService = new UIService(<HTMLDivElement>main);

	if (!AppService.isSupportedScreenSize()) {
		uiService.showMessage(`Resolution not supported! (Min.: ${AppConfig.fieldWidth}x${AppConfig.fieldHeight})`);
		return;
	}

	uiService.renderText({ cssClass: "appTitle", x: 0, y: 0, width: AppConfig.fieldWidth, height: 25, text: AppConfig.appTitle });

	const field = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	uiService.renderField(field);
})();
