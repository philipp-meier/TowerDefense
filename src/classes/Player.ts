import { IPriced } from "../Interfaces.js";
import { PlayerStatusBar } from "./PlayerStatusBar.js";

export class Player {
	private m_Coins = 200;
	private m_Health = 100;
	private m_playerStatusBar: PlayerStatusBar;

	constructor() {
		this.m_playerStatusBar = new PlayerStatusBar(this);
	}

	public getHealth(): number {
		return this.m_Health;
	}
	public getCoins(): number {
		return this.m_Coins;
	}
	public buy(item: IPriced): void {
		if (this.m_Coins < item.getPrice())
			throw new Error('Item is too expensive.');

		this.m_Coins -= item.getPrice();
	}
	public getStatusBar(): PlayerStatusBar {
		return this.m_playerStatusBar;
	}
}
