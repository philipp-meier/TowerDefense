/*
	=== Enemies ===
	Contains all enemy game objects. The classes "Enemy" and "ShootingEnemy" can also be used as base classes
	for new enemy types, since all values and images can be configured individually.
*/
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
	private readonly m_damage: number;

	protected constructor(lane: number, svgPath: string, waveValues: IWaveDependentValues) {
		super(lane, (GameSettings.fieldWidth - GameSettings.singleFieldWidth), svgPath, GameSettings.enemyMoveSpeed);

		// Wave dependent values
		this.m_damage = waveValues.attackDamage;
		this.m_health = waveValues.health;
		this.m_maxHealth = waveValues.health;
	}

	public abstract getCoins(): number;
	public abstract getAttackSpeed(): number;
	public getAttackDamage = (): number => this.m_damage;

	protected isStationary = (): boolean => false;
	protected getMoveDirection = (): number => -1;
}

export class Enemy extends EnemyBase {
	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "enemy/base.svg", waveValues);
	}

	public getCoins = (): number => GameSettings.enemyCoins;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }

	protected getDamageSvg1 = (): string => "enemy/damaged1.svg";
	protected getDamageSvg2 = (): string => "enemy/damaged2.svg";
}

export class ShootingEnemy extends EnemyBase implements IShootingGameObject {
	private readonly m_attackSpeed: number;
	private m_isBulletSpawnable: boolean;

	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "shootingEnemy/base.svg", waveValues);

		// Wave dependent values
		this.m_isBulletSpawnable = true;
		this.m_attackSpeed = waveValues.attackSpeed;
	}

	public spawnBullet(): Bullet {
		if (!this.m_isBulletSpawnable)
			throw new Error("Bullet not spawnable.");

		this.m_isBulletSpawnable = false;
		setTimeout(() => { this.m_isBulletSpawnable = true; }, GameSettings.shootingEnemyBulletSpawnTimeInMs);
		return new Bullet(this.getLane(), this.getPositionX(), 'shootingEnemy/bullets.svg', this.getAttackDamage(), this.getAttackSpeed(), true);
	}

	public isBulletSpawnable = (): boolean => this.m_isBulletSpawnable;
	public getCoins = (): number => GameSettings.shootingEnemyCoins;
	public getAttackSpeed = (): number => this.m_attackSpeed;

	protected getDamageSvg1 = (): string => "shootingEnemy/damaged1.svg";
	protected getDamageSvg2 = (): string => "shootingEnemy/damaged2.svg";
}
