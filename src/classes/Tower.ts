import { IGameObject, IGameObjectOption, IGameField, IUpgradableGameObject } from "./Interfaces.js";

export class Tower implements IUpgradableGameObject {
	private static currentId: number = 1;
	private m_id: number;
	private m_health: number = 100;
	private m_armor: number = 0;
	private m_damage: number = 15;
	private m_attackSpeed: number = 1;
	private m_upgrades: IGameObject[] = [];
	private m_assignedGameField: IGameField | null = null;
	private m_svg = 'tower_base.svg';

	constructor() {
		this.m_id = Tower.currentId++;
	}

	public getID(): number { return this.m_id; }
	public getHealth(): number { return this.m_health; }
	public getArmor(): number { return this.m_armor; }
	public getDamage(): number { return this.m_damage; }
	public getAttackSpeed(): number { return this.m_attackSpeed; }
	public getAssignedGameField(): IGameField | null { return this.m_assignedGameField; }
	public getUpgrades(): IGameObject[] { return this.m_upgrades; }
	public getSvg(): string { return this.m_svg; }

	public getOptions(): IGameObjectOption[] {
		return [{
			title: "Upgrade",
			execute: () => { this.m_svg = 'tower_upgrade_1.svg'; }
		}]
	}
	public placeObject(field: IGameField): void {
		this.m_assignedGameField = field;
	}
}
