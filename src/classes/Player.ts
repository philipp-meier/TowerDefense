import { IPriced } from "../Interfaces.js";

export class Player {
	private m_Coins: number = 100;

	constructor() { }

	public getCoins(): number {
		return this.m_Coins;
	}
	public buy(item: IPriced) {
		if (this.m_Coins < item.getPrice())
			throw new Error('Item is too expensive.');

		this.m_Coins -= item.getPrice();
	}
}
