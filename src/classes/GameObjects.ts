import { IGameField, IGameObjectOption, IPriced } from "../Interfaces.js";

export abstract class GameObjectBase {
	private static currentId = 1;
	private m_id: number;
	protected m_svg: string;

	constructor(svg: string) {
		this.m_svg = svg;
		this.m_id = GameObject.currentId++;
	}

	public getID(): number { return this.m_id; }
	public getSvg(): string { return this.m_svg; }
}
export class GameObject extends GameObjectBase {
	private m_health = 100;
	private m_armor = 0;

	constructor(svg: string) {
		super(svg);
	}
	
	public getHealth(): number { return this.m_health; }
	public getArmor(): number { return this.m_armor; }
}

export class BuyableGameObject extends GameObject implements IPriced {
	private m_price: number;
	private m_assignedGameField: IGameField | null = null;

	constructor(svg: string, price: number) {
		super(svg);
		this.m_price = price;
	}

	public getAssignedGameField(): IGameField | null { return this.m_assignedGameField; }
	public getOptions(): IGameObjectOption[] { return []; }

	public getPrice(): number { return this.m_price; }
	public placeObject(field: IGameField): void {
		this.m_assignedGameField = field;
	}
}
