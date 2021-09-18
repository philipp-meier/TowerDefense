import { IAttackGameObject } from "../Interfaces.js";
import { GameObjectBase } from "./GameObjects.js";

export class Bullet extends GameObjectBase implements IAttackGameObject {
	private m_damage: number;
	private m_speed: number;

	constructor(svgName: string, damage: number, speed: number) {
		super(svgName);
		this.m_damage = damage;
		this.m_speed = speed;
	}

	public getAttackSpeed = (): number => this.m_speed;
	public getAttackDamage = (): number => this.m_damage;
}
