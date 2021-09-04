import { IBuyableGameObject, IGameObjectOption } from "../Interfaces.js";
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

	public buyGameObject(gameObject: IBuyableGameObject): void {
		// TODO: Object should not be created at all, if it is too expensive.
		this.m_player.buy(gameObject);
		this.m_buyableGameObjects.push(gameObject);
	}
	public getBuyableGameObjectById(id: number): IBuyableGameObject | undefined {
		return this.m_buyableGameObjects.find(x => x.getID() == id);
	}

	public buyGameObjectOption(option: IGameObjectOption): void {
		this.m_player.buy(option);
	}

	public getPlayerStatusBar(): PlayerStatusBar {
		return this.m_player.getStatusBar();
	}
	public getGameBoard(): GameBoard {
		return this.m_gameBoard;
	}
}
