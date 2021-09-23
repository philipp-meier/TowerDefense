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

	protected abstract getDamageSvg1(): string;
	protected abstract getDamageSvg2(): string;

	public takeDamage(damage: number): void {
		this.m_health -= damage;

		const healthInPercent = this.getHealthInPercent();
		if (healthInPercent > 25 && healthInPercent <= 70 && this.m_svg !== this.getDamageSvg1()) {
			this.m_svg = this.getDamageSvg1();
			this.m_hasSvgChanged = true;
		} else if (healthInPercent <= 25 && this.m_svg !== this.getDamageSvg2()) {
			this.m_svg = this.getDamageSvg2();
			this.m_hasSvgChanged = true;
		}
	}

	public abstract getCoins(): number;
	public abstract getAttackSpeed(): number;
	public getAttackDamage = (): number => this.m_damage;
	public getMoveSpeed = (): number => 1;
}

export class Enemy extends EnemyBase {
	constructor(lane: number, waveValues: IWaveDependentValues) {
		super(lane, "Enemy/enemy.svg", waveValues);
	}

	public getCoins = (): number => GameSettings.enemyCoins;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }

	protected getDamageSvg1 = (): string => "Enemy/enemyDamaged1.svg";
	protected getDamageSvg2 = (): string => "Enemy/enemyDamaged2.svg";
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

	protected getDamageSvg1 = (): string => "Enemy/shootingEnemyDamaged1.svg";
	protected getDamageSvg2 = (): string => "Enemy/shootingEnemyDamaged2.svg";
}
