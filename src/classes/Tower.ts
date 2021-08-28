import { IGameObjectOption, IGameField, IBuyableGameObject } from "../Interfaces.js";

export class Tower implements IBuyableGameObject {
	private static currentId: number = 1;
	private m_id: number;
	private m_health: number = 100;
	private m_armor: number = 0;
	private m_damage: number = 15;
	private m_attackSpeed: number = 1;
	private m_assignedGameField: IGameField | null = null;
	private m_svg = 'Tower/level1.svg';
	private m_upgrades: number = 0;

	constructor() {
		this.m_id = Tower.currentId++;
	}

	public getID(): number { return this.m_id; }
	public getHealth(): number { return this.m_health; }
	public getArmor(): number { return this.m_armor; }
	public getDamage(): number { return this.m_damage; }
	public getAttackSpeed(): number { return this.m_attackSpeed; }
	public getAssignedGameField(): IGameField | null { return this.m_assignedGameField; }
	public getSvg(): string { return this.m_svg; }
	public getPrice(): number { return 50; }

	public getOptions(): IGameObjectOption[] {
		return [{
			title: "Upgrade",
			execute: () => {
				if (this.m_upgrades == 0) {
					this.m_upgrades++;
					this.m_svg = 'Tower/level2.svg';
				} else {
					this.m_svg = 'Tower/level3.svg';
				}
			}
		}]
	}
	public placeObject(field: IGameField): void {
		this.m_assignedGameField = field;
	}
}
