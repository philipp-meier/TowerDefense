/*
	=== Bullet ===
	Generic bullet class, which is being used by enemy- and player game objects.
*/
import { IAttackingGameObject } from "../Interfaces.js";
import { GameObjectBase } from "./GameObjectBase.js";

export class Bullet extends GameObjectBase implements IAttackingGameObject {
	private readonly m_damage: number;
	private readonly m_speed: number;
	private readonly m_isEnemyBullet: boolean;

	constructor(lane: number, posX: number, svgName: string, damage: number, speed: number, isEnemyBullet = false) {
		super(lane, posX, svgName, speed);
		this.m_damage = damage;
		this.m_speed = speed;
		this.m_isEnemyBullet = isEnemyBullet;
	}

	public getAttackSpeed = (): number => this.m_speed;
	public getAttackDamage = (): number => this.m_damage;
	public isEnemyBullet = (): boolean => this.m_isEnemyBullet;

	protected isStationary = (): boolean => false;
	protected getMoveDirection = (): number => this.m_isEnemyBullet ? -1 : 1;
}
