import { IGameObjectOption, IPricedObject } from "../Interfaces.js";

export abstract class GameObjectBase {
	private static currentId = 1;
	private m_id: number;
	protected m_svg: string;

	constructor(svg: string) {
		this.m_svg = svg;
		this.m_id = GameObject.currentId++;
	}

	public getID = (): number => this.m_id;
	public getSvg = (): string => this.m_svg;
}

export abstract class GameObject extends GameObjectBase {
	public static MaxHealth = 100;

	private m_health = GameObject.MaxHealth;
	private m_armor = 0;

	constructor(svg: string) {
		super(svg);
	}

	public takeDamage(damage: number): void {
		this.m_health -= damage;
	}
	public setHealth(health: number): void {
		this.m_health = health;
	}

	public getHealth = (): number => this.m_health;
	public getArmor = (): number => this.m_armor;
}

export abstract class BuyableGameObject extends GameObject implements IPricedObject {
	public identifier: string;
	private m_price: number;

	constructor(identifier: string, svg: string, price: number) {
		super(svg);
		this.m_price = price;
		this.identifier = identifier;
	}

	public getOptions = (): IGameObjectOption[] => [];
	public getPrice = (): number => this.m_price;
}
