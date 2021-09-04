import { Player } from "./Player.js";

export class PlayerStatusBar {
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
