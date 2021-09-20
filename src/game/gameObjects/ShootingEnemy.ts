import { IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { Enemy } from "./Enemy.js";

export class ShootingEnemy extends Enemy implements IShootingGameObject {
	protected m_coins = 75;
	protected m_damage = 30;

	constructor(lane: number) {
		super(lane);
	}

	public spawnBullet = (): Bullet => new Bullet('Enemy/bullets1.svg', this.getAttackDamage(), this.getAttackSpeed(), true);
	public getAttackSpeed = (): number => 5;
}
