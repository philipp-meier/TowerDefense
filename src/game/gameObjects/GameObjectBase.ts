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

	protected m_health = 100;
	protected m_maxHealth = 100;
	private m_armor = 0;
	private m_gameBoardLane: number;

	constructor(lane: number, svg: string) {
		super(svg);
		this.m_gameBoardLane = lane;
	}

	public takeDamage(damage: number): void {
		this.m_health -= damage;
	}
	public setHealth(health: number): void {
		this.m_health = health;
	}

	public getArmor = (): number => this.m_armor;
	public getHealth = (): number => this.m_health;
	public getMaxHealth = (): number => this.m_maxHealth;
	public getHealthInPercent = (): number => this.m_health / this.m_maxHealth * 100;
	public getLane = (): number => this.m_gameBoardLane;
}
