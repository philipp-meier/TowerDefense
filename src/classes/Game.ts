import { IBuyableGameObject } from "../Interfaces.js";
import { Player } from "./Player.js";
import { PlayerStatusBar } from "./PlayerStatusBar.js";

export class Game {
	private m_buyableGameObjects: IBuyableGameObject[] = [];
	private m_player: Player;
	private m_playerStatusBar: PlayerStatusBar;

	constructor(player: Player) {
		this.m_player = player;
		this.m_playerStatusBar = new PlayerStatusBar(player);
	}

	public addBuyableGameObject(gameObject: IBuyableGameObject): void {
		// TODO: Object should not be created at all, if it is too expensive.
		this.m_player.buy(gameObject);
		this.m_buyableGameObjects.push(gameObject);
	}
	public getBuyableGameObjectById(id: number): IBuyableGameObject | undefined {
		return this.m_buyableGameObjects.find(x => x.getID() == id);
	}

	public getPlayerStatusBar(): PlayerStatusBar {
		return this.m_playerStatusBar;
	}
}
