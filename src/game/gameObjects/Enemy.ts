import { IAttackingGameObject } from "../Interfaces.js";
import { GameObject } from "./GameObjectBase.js";

export class Enemy extends GameObject implements IAttackingGameObject {
	private m_gameBoardLane: number;
	protected m_coins = 50;
	protected m_damage = 20;
	protected m_enemyWave;

	constructor(enemyWave: number, lane: number) {
		super('Enemy/enemy1.svg');
		this.m_enemyWave = enemyWave;
		this.m_gameBoardLane = lane;

		// Wave dependent values
		this.m_damage = this.calcValueByWave(this.m_damage, 20);
		this.m_health = this.calcValueByWave(this.m_health, 30);
		this.m_maxHealth = this.calcValueByWave(this.m_maxHealth, 30);
	}

	public getLane = (): number => this.m_gameBoardLane;
	public getCoins = (): number => this.m_coins;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }
	public getAttackDamage = (): number => this.m_damage;
	public getMoveSpeed = (): number => 1;

	protected calcValueByWave(value: number, percentIncrPerWave: number): number {
		if (this.m_enemyWave <= 1)
			return value;

		return value + ((value / 100) * percentIncrPerWave * this.m_enemyWave);
	}
}
