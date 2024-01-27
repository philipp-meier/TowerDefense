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
	private readonly m_classIdentifier: string;
	private readonly m_price: number;
	private readonly m_initialSvg: string;

	protected constructor(lane: number, posX: number, classIdentifier: string, svg: string, price: number) {
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
		super(lane, posX, "Rampart", "rampart/base.svg", GameSettings.rampartPrice);

		this.m_health = GameSettings.rampartHealth;
		this.m_maxHealth = GameSettings.rampartHealth;
	}

	public getOptions = (): IGameObjectOption[] => [this.createRepairOption(GameSettings.rampartRepairPrice)];

	protected getDamageSvg1 = (): string => "rampart/damaged1.svg";
	protected getDamageSvg2 = (): string => "rampart/damaged2.svg";
}

export class Tower extends PlayerGameObjectBase implements IShootingGameObject {
	private m_currentUpgradeLevel: number;
	private m_bulletSvg: string;
	private readonly m_attackSpeed: number;
	private m_attackDamage: number;
	private m_isBulletSpawnable: boolean;

	constructor(lane: number, posX: number) {
		super(lane, posX, "Tower", "tower/upgrade0/base.svg", GameSettings.towerPrice);

		this.m_bulletSvg = this.getBulletSvg(0);
		this.m_currentUpgradeLevel = 0;
		this.m_isBulletSpawnable = true;
		this.m_health = GameSettings.towerHealth;
		this.m_maxHealth = GameSettings.towerHealth;
		this.m_attackSpeed = GameSettings.towerAttackSpeed;
		this.m_attackDamage = GameSettings.towerAttackDamage;
	}

	private createUpgradeGameObjectOption(title: string, price: number, isAvailable = true): IGameObjectOption {
		return {
			title: `${price}$ - ${title}`,
			isAvailable: isAvailable,
			execute: () => {
				this.m_currentUpgradeLevel++;

				this.m_svg = this.getTowerSvg(this.m_currentUpgradeLevel);
				this.m_bulletSvg = this.getBulletSvg(this.m_currentUpgradeLevel);
				this.m_attackDamage += GameSettings.towerUpgradeDamageIncrease;
				this.m_hasSvgChanged = true;
			},
			getPrice: () => price
		};
	}

	public getOptions = (): IGameObjectOption[] => {
		const options: IGameObjectOption[] = [];
		if (this.m_currentUpgradeLevel == 0)
			options.push(this.createUpgradeGameObjectOption("Upgrade 1", GameSettings.towerUpgrade1Price));
		else if (this.m_currentUpgradeLevel == 1)
			options.push(this.createUpgradeGameObjectOption("Upgrade 2", GameSettings.towerUpgrade2Price));

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

	protected getFullHealthSvg = (): string => this.getTowerSvg(this.m_currentUpgradeLevel);
	protected getDamageSvg1 = (): string => `tower/upgrade${this.m_currentUpgradeLevel}/damaged1.svg`;
	protected getDamageSvg2 = (): string => `tower/upgrade${this.m_currentUpgradeLevel}/damaged2.svg`;

	private getTowerSvg = (upgradeLevel: number): string => `tower/upgrade${upgradeLevel}/base.svg`;
	private getBulletSvg = (upgradeLevel: number): string => `tower/upgrade${upgradeLevel}/bullets.svg`;
}
