import { IGameObjectOption, IPlayerStatusInfo, IUIService } from "../Interfaces.js";
import { BuyableGameObject, GameObject } from "./GameObjects.js";
import { AppConfig } from "../services/AppService.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";

export class Game {
	private m_player: Player;
	private m_gameBoard: GameBoard;
	private m_gameObjects: GameObject[] = [];

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

	public buyGameObject(gameObject: BuyableGameObject): void {
		// TODO: Object should not be created at all, if it is too expensive.
		this.m_player.buyItem(gameObject);
		this.m_gameObjects.push(gameObject);
	}
	public buyGameObjectOption(option: IGameObjectOption): void {
		this.m_player.buyItem(option);
	}

	public getBuyableGameObjectById(id: number): BuyableGameObject | undefined {
		return <BuyableGameObject | undefined>this.m_gameObjects.find(x => x instanceof BuyableGameObject && x.getID() == id);
	}
	public getPlayerStatusInfo(): IPlayerStatusInfo {
		return {
			health: this.m_player.getHealth(),
			coins: this.m_player.getCoins()
		};
	}
}
