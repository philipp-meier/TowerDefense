export abstract class GameObjectBase {
	private static currentId = 1;
	private m_id: number;
	protected m_svg: string;

	constructor(svg: string) {
		this.m_svg = svg;
		this.m_id = GameObjectBase.currentId++;
	}

	public getID = (): number => this.m_id;
	public getSvg = (): string => this.m_svg;
}

export abstract class GameObject extends GameObjectBase {
	protected m_health = 100;
	protected m_maxHealth = 100;
	protected m_hasSvgChanged = false;
	private m_gameBoardLane: number;

	constructor(lane: number, svg: string) {
		super(svg);
		this.m_gameBoardLane = lane;
	}

	public takeDamage(damage: number): void {
		this.m_health -= damage;

		const healthInPercent = this.getHealthInPercent();
		if (healthInPercent > 25 && healthInPercent <= 70 && this.m_svg !== this.getDamageSvg1()) {
			this.m_svg = this.getDamageSvg1();
			this.m_hasSvgChanged = true;
		} else if (healthInPercent <= 25 && this.m_svg !== this.getDamageSvg2()) {
			this.m_svg = this.getDamageSvg2();
			this.m_hasSvgChanged = true;
		}
	}

	public setHealth(health: number): void {
		this.m_health = health;
	}

	public getHealth = (): number => this.m_health;
	public getMaxHealth = (): number => this.m_maxHealth;
	public getHealthInPercent = (): number => this.m_health / this.m_maxHealth * 100;
	public getLane = (): number => this.m_gameBoardLane;

	public hasSvgChanged = (): boolean => this.m_hasSvgChanged;
	public acknowledgeSvgChange = (): void => { this.m_hasSvgChanged = false; }

	protected abstract getDamageSvg1(): string;
	protected abstract getDamageSvg2(): string;
}
