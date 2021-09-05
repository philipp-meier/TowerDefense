import { GameObjectBase } from "./GameObjects.js";

export class Bullet extends GameObjectBase {
	private m_damage: number;
	private m_speed: number;

	constructor(svgName: string, damage: number, speed: number) {
		super(svgName);
		this.m_damage = damage;
		this.m_speed = speed;
	}

	public getSpeed(): number { return this.m_speed; }
	public getDamage(): number { return this.m_damage; }
}
