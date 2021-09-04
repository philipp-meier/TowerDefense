import { IBuyableGameObject, IGameObjectOption, IPlayerStatusInfo, IUIService } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";

export class Game {
	private m_buyableGameObjects: IBuyableGameObject[] = [];
	private m_player: Player;
	private m_gameBoard: GameBoard;

	constructor() {
		this.m_player = new Player();
		this.m_gameBoard = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	}

	public start(uiService: IUIService): void {
		uiService.renderAppTitle(AppConfig.appTitle);
		uiService.renderPlayerStatusBar(this.getPlayerStatusInfo());
		uiService.renderGameBoard(this.m_gameBoard);

		this.updateLoop(uiService);
	}
	private updateLoop(uiService: IUIService): void {
		uiService.refreshUI();
		window.requestAnimationFrame(() => { this.updateLoop(uiService); });
	}

	public buyGameObject(gameObject: IBuyableGameObject): void {
		// TODO: Object should not be created at all, if it is too expensive.
		this.m_player.buyItem(gameObject);
		this.m_buyableGameObjects.push(gameObject);
	}
	public buyGameObjectOption(option: IGameObjectOption): void {
		this.m_player.buyItem(option);
	}

	public getBuyableGameObjectById(id: number): IBuyableGameObject | undefined {
		return this.m_buyableGameObjects.find(x => x.getID() == id);
	}
	public getPlayerStatusInfo(): IPlayerStatusInfo {
		return {
			health: this.m_player.getHealth(),
			coins: this.m_player.getCoins()
		};
	}
}
