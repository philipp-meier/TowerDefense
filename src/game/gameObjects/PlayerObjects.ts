/*
	=== Player Game Objects ===
	Contains all player game objects. Player game objects are stationary objects like "Rampart" and "Tower",
	which may offer options like (for example) upgrades. New player game objects can be derived from "PlayerGameObjectBase".
*/
import { GameSettings } from "../GameSettings.js";
import { IGameObjectOption, IPricedObject, IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { GameObject } from "./GameObjectBase.js";

export abstract class PlayerGameObjectBase extends GameObject implements IPricedObject {
	private m_classIdentifier: string;
	private m_price: number;
	private m_initialSvg: string;

	constructor(lane: number, posX: number, classIdentifier: string, svg: string, price: number) {
		super(lane, posX, svg);
		this.m_initialSvg = svg;
		this.m_price = price;
		this.m_classIdentifier = classIdentifier;
	}

	public getOptions = (): IGameObjectOption[] => [];
	public getPrice = (): number => this.m_price;
	public getClassIdentifier = (): string => this.m_classIdentifier;

	protected getFullHealthSvg = (): string => this.m_initialSvg;
	protected createRepairOption(repairPrice: number): IGameObjectOption {
		return {
			title: `${repairPrice}$ - Repair`,
			isAvailable: this.getHealth() < this.getMaxHealth(),
			getPrice: () => repairPrice,
			execute: () => {
				this.m_svg = this.getFullHealthSvg();
				this.m_hasSvgChanged = true;
				this.setHealth(this.getMaxHealth());
			}
		};
	}

	protected isStationary = (): boolean => true;
}

export class Rampart extends PlayerGameObjectBase {
	constructor(lane: number, posX: number) {
		super(lane, posX, "Rampart", "Rampart/rampart.svg", GameSettings.rampartPrice);

		this.m_health = GameSettings.rampartHealth;
		this.m_maxHealth = GameSettings.rampartHealth;
	}

	public getOptions = (): IGameObjectOption[] => [this.createRepairOption(GameSettings.rampartRepairPrice)];

	protected getDamageSvg1 = (): string => "Rampart/rampart_damaged1.svg";
	protected getDamageSvg2 = (): string => "Rampart/rampart_damaged2.svg";
}

export class Tower extends PlayerGameObjectBase implements IShootingGameObject {
	private m_currentUpgradeLevel: number;
	private m_bulletSvg: string;
	private m_attackSpeed: number;
	private m_attackDamage: number;
	private m_isBulletSpawnable: boolean;

	constructor(lane: number, posX: number) {
		super(lane, posX, "Tower", "Tower/level1.svg", GameSettings.towerPrice);

		this.m_bulletSvg = "Tower/bullets1.svg";
		this.m_currentUpgradeLevel = 0;
		this.m_isBulletSpawnable = true;
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
				this.m_hasSvgChanged = true;
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

	public spawnBullet(): Bullet {
		if (!this.m_isBulletSpawnable)
			throw new Error("Bullet not spawnable.");

		this.m_isBulletSpawnable = false;
		setTimeout(() => { this.m_isBulletSpawnable = true; }, GameSettings.towerBulletSpawnTimeInMs);
		return new Bullet(this.getLane(), this.getPositionX(), this.m_bulletSvg, this.m_attackDamage, this.m_attackSpeed);
	}

	public isBulletSpawnable = (): boolean => this.m_isBulletSpawnable;
	public getAttackSpeed = (): number => this.m_attackSpeed;
	public getAttackDamage = (): number => this.m_attackDamage;

	protected getFullHealthSvg = (): string => `Tower/level${this.m_currentUpgradeLevel + 1}.svg`;
	protected getDamageSvg1 = (): string => `Tower/level${this.m_currentUpgradeLevel + 1}_damaged1.svg`;
	protected getDamageSvg2 = (): string => `Tower/level${this.m_currentUpgradeLevel + 1}_damaged2.svg`;
}
