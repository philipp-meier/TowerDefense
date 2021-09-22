import { IAttackingGameObject, IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { GameObject } from "./GameObjectBase.js";

export interface IWaveDependentValues {
	health: number;
	maxHealth: number;
	attackDamage: number;
	attackSpeed: number;
}

export abstract class EnemyBase extends GameObject implements IAttackingGameObject {
	protected m_coins = 50;
	protected m_damage = 20;

	constructor(lane: number, svgPath: string, waveValues: IWaveDependentValues) {
		super(lane, svgPath);

		// Wave dependent values
		this.m_damage = waveValues.attackDamage;
		this.m_health = waveValues.health;
		this.m_maxHealth = waveValues.maxHealth;
	}

	public getCoins = (): number => this.m_coins;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }
	public getAttackDamage = (): number => this.m_damage;
	public getMoveSpeed = (): number => 1;
}

export class Enemy extends EnemyBase {
	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "Enemy/enemy1.svg", waveValues);
	}
}

export class ShootingEnemy extends EnemyBase implements IShootingGameObject {
	protected m_coins = 75;
	protected m_damage = 30;
	protected m_attackSpeed = 5;

	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "Enemy/shootingEnemy1.svg", waveValues);

		// Wave dependent values
		this.m_attackSpeed = waveValues.attackSpeed;
	}

	public spawnBullet = (): Bullet => new Bullet('Enemy/bullets1.svg', this.getAttackDamage(), this.getAttackSpeed(), true);
	public getAttackSpeed = (): number => this.m_attackSpeed;
}
