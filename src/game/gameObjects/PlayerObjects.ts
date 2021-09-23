import { GameSettings } from "../GameSettings.js";
import { IGameObjectOption, IPricedObject, IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { GameObject } from "./GameObjectBase.js";

export abstract class PlayerGameObjectBase extends GameObject implements IPricedObject {
	private m_classIdentifier: string;
	private m_price: number;

	constructor(lane: number, classIdentifier: string, svg: string, price: number) {
		super(lane, svg);
		this.m_price = price;
		this.m_classIdentifier = classIdentifier;
	}

	public getOptions = (): IGameObjectOption[] => [];
	public getPrice = (): number => this.m_price;
	public getClassIdentifier = (): string => this.m_classIdentifier;

	protected createRepairOption(repairPrice: number): IGameObjectOption {
		return {
			title: `${repairPrice}$ - Repair`,
			isAvailable: this.getHealth() < this.getMaxHealth(),
			getPrice: () => repairPrice,
			execute: () => this.setHealth(this.getMaxHealth())
		};
	}
}

export class Rampart extends PlayerGameObjectBase {
	constructor(lane: number) {
		super(lane, 'Rampart', 'Rampart/rampart.svg', GameSettings.rampartPrice);

		this.m_health = GameSettings.rampartHealth;
		this.m_maxHealth = GameSettings.rampartHealth;
	}

	public getOptions = (): IGameObjectOption[] => [this.createRepairOption(GameSettings.rampartRepairPrice)];
}

export class Tower extends PlayerGameObjectBase implements IShootingGameObject {
	private m_currentUpgradeLevel: number;
	private m_bulletSvg: string;
	private m_attackSpeed: number;
	private m_attackDamage: number;

	constructor(lane: number) {
		super(lane, "Tower", "Tower/level1.svg", GameSettings.towerPrice);

		this.m_bulletSvg = "Tower/bullets1.svg";
		this.m_currentUpgradeLevel = 0;
		this.m_health = GameSettings.towerHealth;
		this.m_maxHealth = GameSettings.towerHealth;
		this.m_attackSpeed = GameSettings.towerAttackSpeed;
		this.m_attackDamage = GameSettings.towerAttackDamage;
	}

	private createUpgradeGameObjectOption(title: string, svgName: string, bulletSvgName: string, price: number, isAvailable: boolean): IGameObjectOption {
		return {
			title: `${price}$ - ${title}`,
			isAvailable: isAvailable,
			execute: () => {
				this.m_currentUpgradeLevel++;
				this.m_svg = svgName;
				this.m_bulletSvg = bulletSvgName;
				this.m_attackDamage += GameSettings.towerUpgradeDamageIncrease;
			},
			getPrice: () => price
		};
	}

	public getOptions = (): IGameObjectOption[] => {
		const options: IGameObjectOption[] = [];
		if (this.m_currentUpgradeLevel == 0)
			options.push(this.createUpgradeGameObjectOption("Upgrade 1", "Tower/level2.svg", "Tower/bullets2.svg", GameSettings.towerUpgrade1Price, true));
		else if (this.m_currentUpgradeLevel == 1)
			options.push(this.createUpgradeGameObjectOption("Upgrade 2", "Tower/level3.svg", "Tower/bullets3.svg", GameSettings.towerUpgrade2Price, true));

		options.push(this.createRepairOption(GameSettings.towerRepairPrice));
		return options;
	}

	public spawnBullet = (): Bullet => new Bullet(this.m_bulletSvg, this.m_attackDamage, this.m_attackSpeed);
	public getAttackSpeed = (): number => this.m_attackSpeed;
	public getAttackDamage = (): number => this.m_attackDamage;
}
