import { GameSettings } from "../GameSettings.js";
import { IAttackingGameObject, IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { GameObject } from "./GameObjectBase.js";

export interface IWaveDependentValues {
	health: number;
	attackDamage: number;
	attackSpeed: number;
}

export abstract class EnemyBase extends GameObject implements IAttackingGameObject {
	private m_damage;

	constructor(lane: number, svgPath: string, waveValues: IWaveDependentValues) {
		super(lane, svgPath);

		// Wave dependent values
		this.m_damage = waveValues.attackDamage;
		this.m_health = waveValues.health;
		this.m_maxHealth = waveValues.health;
	}

	public abstract getCoins(): number;
	public abstract getAttackSpeed(): number;
	public getAttackDamage = (): number => this.m_damage;
	public getMoveSpeed = (): number => 1;
}

export class Enemy extends EnemyBase {
	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "Enemy/enemy1.svg", waveValues);
	}

	public getCoins = (): number => GameSettings.enemyCoins;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }
}

export class ShootingEnemy extends EnemyBase implements IShootingGameObject {
	private m_attackSpeed;

	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "Enemy/shootingEnemy1.svg", waveValues);

		// Wave dependent values
		this.m_attackSpeed = waveValues.attackSpeed;
	}

	public spawnBullet = (): Bullet => new Bullet('Enemy/bullets1.svg', this.getAttackDamage(), this.getAttackSpeed(), true);

	public getCoins = (): number => GameSettings.shootingEnemyCoins;
	public getAttackSpeed = (): number => this.m_attackSpeed;
}
