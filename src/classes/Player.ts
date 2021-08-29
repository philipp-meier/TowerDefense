import { IPriced } from "../Interfaces.js";

export class Player {
	private m_Coins: number = 200;
	private m_Health: number = 100;

	constructor() { }

	public getHealth(): number {
		return this.m_Health;
	}
	public getCoins(): number {
		return this.m_Coins;
	}
	public buy(item: IPriced) {
		if (this.m_Coins < item.getPrice())
			throw new Error('Item is too expensive.');

		this.m_Coins -= item.getPrice();
	}
}
