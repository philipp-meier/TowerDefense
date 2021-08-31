import { IPriced } from "../Interfaces.js";

export class Player {
	private m_Coins = 200;
	private m_Health = 100;

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
}
