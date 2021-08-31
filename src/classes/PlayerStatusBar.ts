import { IPlayerStatusBar } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";
import { Player } from "./Player.js";

export class PlayerStatusBar implements IPlayerStatusBar {
	cssClass = "player-status-bar";
	height = 25;
	width = AppConfig.fieldWidth;

	private m_Player: Player;

	constructor(player: Player) {
		this.m_Player = player;
	}

	getHealth(): number {
		return this.m_Player.getHealth();
	}
	getCoins(): number {
		return this.m_Player.getCoins();
	}
}
