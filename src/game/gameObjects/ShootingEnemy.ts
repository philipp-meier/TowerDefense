import { IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { Enemy } from "./Enemy.js";

export class ShootingEnemy extends Enemy implements IShootingGameObject {
	protected m_coins = 75;
	protected m_damage = 30;
	protected m_attackSpeed = 5;

	constructor(enemyWave: number, lane: number) {
		super(enemyWave, lane);

		// Wave dependent values
		this.m_attackSpeed = this.calcValueByWave(this.m_attackSpeed, 10);
	}

	public spawnBullet = (): Bullet => new Bullet('Enemy/bullets1.svg', this.getAttackDamage(), this.getAttackSpeed(), true);
	public getAttackSpeed = (): number => this.m_attackSpeed;
}
