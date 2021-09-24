/*
	=== Game Objects ===
	Contains the base game objects, from which enemy- and player game objects are derived.
	Behavior which is defined here, will apply to all game objects.
*/
export abstract class GameObjectBase {
	private static currentId = 1;
	protected m_svg: string;

	private m_id: number;
	private m_posX: number;
	private m_gameBoardLane: number;
	private m_moveSpeed: number;

	constructor(lane: number, posX: number, svg: string, moveSpeed = 0) {
		this.m_id = GameObjectBase.currentId++;
		this.m_svg = svg;
		this.m_gameBoardLane = lane;
		this.m_posX = posX;
		this.m_moveSpeed = moveSpeed;
	}

	public update(): void {
		if (!this.isStationary()) {
			// Move game object
			this.m_posX += (this.m_moveSpeed * this.getMoveDirection());
		}
	}

	public getID = (): number => this.m_id;
	public getSvg = (): string => this.m_svg;
	public getPositionX = (): number => this.m_posX;
	public getLane = (): number => this.m_gameBoardLane;

	protected abstract isStationary(): boolean;
	protected getMoveDirection = (): number => 1; // 1 = Left to right, -1 = Right to left
}

export abstract class GameObject extends GameObjectBase {
	protected m_health = 100;
	protected m_maxHealth = 100;
	protected m_hasSvgChanged = false;

	constructor(lane: number, posX: number, svg: string, moveSpeed = 0) {
		super(lane, posX, svg, moveSpeed);
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

	public hasSvgChanged = (): boolean => this.m_hasSvgChanged;
	public acknowledgeSvgChange = (): void => { this.m_hasSvgChanged = false; }

	protected abstract getDamageSvg1(): string;
	protected abstract getDamageSvg2(): string;
}
