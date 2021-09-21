import { IAttackingGameObject, IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { GameObject } from "./GameObjectBase.js";

export interface IWaveDependentValues {
	health: number;
	maxHealth: number;
	attackDamage: number;
	attackSpeed: number;
}

export class Enemy extends GameObject implements IAttackingGameObject {
	private m_gameBoardLane: number;
	protected m_coins = 50;
	protected m_damage = 20;

	constructor(enemyWave: number, lane: number, waveValues: IWaveDependentValues) {
		super('Enemy/enemy1.svg');
		this.m_gameBoardLane = lane;

		// Wave dependent values
		this.m_damage = waveValues.attackDamage;
		this.m_health = waveValues.health;
		this.m_maxHealth = waveValues.maxHealth;
	}

	public getLane = (): number => this.m_gameBoardLane;
	public getCoins = (): number => this.m_coins;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }
	public getAttackDamage = (): number => this.m_damage;
	public getMoveSpeed = (): number => 1;
}

export class ShootingEnemy extends Enemy implements IShootingGameObject {
	protected m_coins = 75;
	protected m_damage = 30;
	protected m_attackSpeed = 5;

	constructor(enemyWave: number, lane: number, waveValues: IWaveDependentValues) {
		super(enemyWave, lane, waveValues);

		// Wave dependent values
		this.m_attackSpeed = waveValues.attackSpeed;
	}

	public spawnBullet = (): Bullet => new Bullet('Enemy/bullets1.svg', this.getAttackDamage(), this.getAttackSpeed(), true);
	public getAttackSpeed = (): number => this.m_attackSpeed;
}
