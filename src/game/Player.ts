import { IPriced } from "./Interfaces.js";

export class Player {
	private m_Coins = 200;
	private m_Health = 100;

	public buyItem(item: IPriced): void {
		if (this.m_Coins < item.getPrice())
			throw new Error('Item is too expensive.');

		this.m_Coins -= item.getPrice();
	}

	public awardCoins(coins: number): void {
		this.m_Coins += coins;
	}
	public takeDamage(damage: number): void {
		if (damage >= this.m_Health)
			this.m_Health = 0;
		else
			this.m_Health -= damage;
	}

	public getHealth = (): number => this.m_Health;
	public getCoins = (): number => this.m_Coins;
}
