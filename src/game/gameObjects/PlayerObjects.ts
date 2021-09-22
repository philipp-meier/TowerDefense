import { IGameObjectOption, IPricedObject, IShootingGameObject } from "../Interfaces.js";
import { Bullet } from "./Bullet.js";
import { GameObject } from "./GameObjectBase.js";

export abstract class PlayerGameObjectBase extends GameObject implements IPricedObject {
	public identifier: string;
	private m_price: number;

	constructor(lane: number, identifier: string, svg: string, price: number) {
		super(lane, svg);
		this.m_price = price;
		this.identifier = identifier;
	}

	public getOptions = (): IGameObjectOption[] => [];
	public getPrice = (): number => this.m_price;
}

export class Rampart extends PlayerGameObjectBase {
	constructor(lane: number) {
		super(lane, 'Rampart', 'Rampart/rampart.svg', 25);
	}

	public getOptions = (): IGameObjectOption[] => {
		return [{
			title: "25$ - Repair",
			isAvailable: this.getHealth() < this.getMaxHealth(),
			getPrice: () => { return 25; },
			execute: () => {
				this.setHealth(this.getMaxHealth());
			}
		}];
	}
}

export class Tower extends PlayerGameObjectBase implements IShootingGameObject {
	private m_upgrades = 0;
	private m_bulletSvg = 'Tower/bullets1.svg';
	private m_attackSpeed = 3;
	private m_attackDamage = 10;

	constructor(lane: number) {
		super(lane, 'Tower', 'Tower/level1.svg', 50);
	}

	private createUpgradeGameObjectOption(title: string, svgName: string, bulletSvgName: string, price: number, isAvailable: boolean): IGameObjectOption {
		return {
			title: `${price}$ - ${title}`,
			isAvailable: isAvailable,
			execute: () => {
				this.m_upgrades++;
				this.m_svg = svgName;
				this.m_bulletSvg = bulletSvgName;
				this.m_attackDamage += 10;
			},
			getPrice: () => { return price; }
		};
	}

	public getOptions = (): IGameObjectOption[] => {
		const options: IGameObjectOption[] = [];
		if (this.m_upgrades == 0)
			options.push(this.createUpgradeGameObjectOption("Upgrade 1", "Tower/level2.svg", "Tower/bullets2.svg", 50, true));
		else if (this.m_upgrades == 1)
			options.push(this.createUpgradeGameObjectOption("Upgrade 2", "Tower/level3.svg", "Tower/bullets3.svg", 100, true));

		options.push({
			title: "50$ - Repair",
			isAvailable: this.getHealth() < this.getMaxHealth(),
			getPrice: () => { return 50; },
			execute: () => {
				this.setHealth(this.getMaxHealth());
			}
		});

		return options;
	}

	public spawnBullet = (): Bullet => new Bullet(this.m_bulletSvg, this.m_attackDamage, this.m_attackSpeed);
	public getAttackSpeed = (): number => this.m_attackSpeed;
	public getAttackDamage = (): number => this.m_attackDamage;
}
