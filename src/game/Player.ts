import { GameSettings } from "./GameSettings.js";
import { IPricedObject } from "./Interfaces.js";

export class Player {
	private m_Coins = GameSettings.playerCoinsStart;
	private m_Health = GameSettings.playerHealthStart;

	public buyItem(item: IPricedObject): void {
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
