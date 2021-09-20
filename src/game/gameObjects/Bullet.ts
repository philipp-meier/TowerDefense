import { IAttackingGameObject as IAttackGameObject } from "../Interfaces.js";
import { GameObjectBase } from "./GameObjectBase.js";

export class Bullet extends GameObjectBase implements IAttackGameObject {
	private m_damage: number;
	private m_speed: number;
	private m_isEnemyBullet: boolean;

	constructor(svgName: string, damage: number, speed: number, isEnemyBullet = false) {
		super(svgName);
		this.m_damage = damage;
		this.m_speed = speed;
		this.m_isEnemyBullet = isEnemyBullet;
	}

	public getAttackSpeed = (): number => this.m_speed;
	public getAttackDamage = (): number => this.m_damage;
	public isEnemyBullet = (): boolean => this.m_isEnemyBullet;
}
