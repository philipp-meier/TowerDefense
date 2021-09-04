import { IBuyableGameObject, IGameObjectOption, IUIService } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";
import { PlayerStatusBar } from "./PlayerStatusBar.js";

export class Game {
	private m_buyableGameObjects: IBuyableGameObject[] = [];
	private m_player: Player;
	private m_gameBoard: GameBoard;

	constructor() {
		this.m_player = new Player();
		this.m_gameBoard = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	}

	public start(uiService: IUIService): void {
		let prevTime = 0.0;
		const updateLoop = (time: number) => {
			prevTime = time;

			uiService.refreshUI();
			window.requestAnimationFrame(updateLoop);
		}
		updateLoop(prevTime);
	}

	public buyGameObject(gameObject: IBuyableGameObject): void {
		// TODO: Object should not be created at all, if it is too expensive.
		this.m_player.buy(gameObject);
		this.m_buyableGameObjects.push(gameObject);
	}
	public buyGameObjectOption(option: IGameObjectOption): void {
		this.m_player.buy(option);
	}

	public getBuyableGameObjectById(id: number): IBuyableGameObject | undefined {
		return this.m_buyableGameObjects.find(x => x.getID() == id);
	}
	public getPlayerStatusBar(): PlayerStatusBar {
		return this.m_player.getStatusBar();
	}
	public getGameBoard(): GameBoard {
		return this.m_gameBoard;
	}
}
