import { IPlayerStatusBar } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";
import { Player } from "./Player.js";

export class PlayerStatusBar implements IPlayerStatusBar {
	public cssClass = "player-status-bar";
	public height = 25;
	public width = AppConfig.fieldWidth;

	private m_Player: Player;

	constructor(player: Player) {
		this.m_Player = player;
	}

	public getHealth(): number {
		return this.m_Player.getHealth();
	}
	public getCoins(): number {
		return this.m_Player.getCoins();
	}
}
