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
	private m_damage: number;
	private m_moveSpeed: number;

	constructor(lane: number, svgPath: string, waveValues: IWaveDependentValues) {
		super(lane, svgPath);
		this.m_moveSpeed = GameSettings.enemyMoveSpeed;

		// Wave dependent values
		this.m_damage = waveValues.attackDamage;
		this.m_health = waveValues.health;
		this.m_maxHealth = waveValues.health;
	}

	public abstract getCoins(): number;
	public abstract getAttackSpeed(): number;
	public getAttackDamage = (): number => this.m_damage;
	public getMoveSpeed = (): number => this.m_moveSpeed;
}

export class Enemy extends EnemyBase {
	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "Enemy/enemy.svg", waveValues);
	}

	public getCoins = (): number => GameSettings.enemyCoins;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }

	protected getDamageSvg1 = (): string => "Enemy/enemy_damaged1.svg";
	protected getDamageSvg2 = (): string => "Enemy/enemy_damaged2.svg";
}

export class ShootingEnemy extends EnemyBase implements IShootingGameObject {
	private m_attackSpeed: number;
	private m_isBulletSpawnable: boolean;

	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "Enemy/shootingEnemy.svg", waveValues);

		// Wave dependent values
		this.m_isBulletSpawnable = true;
		this.m_attackSpeed = waveValues.attackSpeed;
	}

	public spawnBullet(): Bullet {
		if (!this.m_isBulletSpawnable)
			throw new Error("Bullet not spawnable.");

		this.m_isBulletSpawnable = false;
		setTimeout(() => { this.m_isBulletSpawnable = true; }, GameSettings.shootingEnemyBulletSpawnTimeInMs);
		return new Bullet('Enemy/bullets.svg', this.getAttackDamage(), this.getAttackSpeed(), true);
	}

	public isBulletSpawnable = (): boolean => this.m_isBulletSpawnable;
	public getCoins = (): number => GameSettings.shootingEnemyCoins;
	public getAttackSpeed = (): number => this.m_attackSpeed;

	protected getDamageSvg1 = (): string => "Enemy/shootingEnemy_damaged1.svg";
	protected getDamageSvg2 = (): string => "Enemy/shootingEnemy_damaged2.svg";
}
