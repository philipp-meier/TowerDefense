import { IGameField, IGameObjectOption, IPriced } from "../Interfaces.js";

export class GameObject {
	private static currentId = 1;
	private m_id: number;
	private m_health = 100;
	private m_armor = 0;
	private m_assignedGameField: IGameField | null = null;
	protected m_svg: string;

	constructor(svg: string) {
		this.m_svg = svg;
		this.m_id = GameObject.currentId++;
	}

	public getOptions(): IGameObjectOption[] {
		return [];
	}
	public placeObject(field: IGameField): void {
		this.m_assignedGameField = field;
	}

	public getID(): number { return this.m_id; }
	public getHealth(): number { return this.m_health; }
	public getArmor(): number { return this.m_armor; }
	public getAssignedGameField(): IGameField | null { return this.m_assignedGameField; }
	public getSvg(): string { return this.m_svg; }
}

export class BuyableGameObject extends GameObject implements IPriced {
	private m_price: number;

	constructor(svg: string, price: number) {
		super(svg);
		this.m_price = price;
	}

	public getPrice(): number { return this.m_price; }
}
