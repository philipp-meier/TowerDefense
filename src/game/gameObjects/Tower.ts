import { IGameObjectOption, IShootingGameObject } from "../Interfaces.js";
import { BuyableGameObject, GameObject } from "./GameObjectBase.js";
import { Bullet } from "./Bullet.js";

export class Tower extends BuyableGameObject implements IShootingGameObject {
	private m_upgrades = 0;
	private m_bulletSvg = 'Tower/bullets1.svg';
	private m_attackSpeed = 5;
	private m_attackDamage = 50;

	constructor() {
		super('Tower', 'Tower/level1.svg', 50);
	}

	private createGameObjectOption(title: string, svgName: string, bulletSvgName: string, price: number, isAvailable: boolean): IGameObjectOption {
		return {
			title: `${price}$ - ${title}`,
			isAvailable: isAvailable,
			execute: () => {
				this.m_upgrades++;
				this.m_svg = svgName;
				this.m_bulletSvg = bulletSvgName;
				this.m_attackSpeed += 5;
				this.m_attackDamage += 50;
			},
			getPrice: () => { return price; }
		};
	}

	public getOptions = (): IGameObjectOption[] => {
		const options: IGameObjectOption[] = [];
		if (this.m_upgrades == 0)
			options.push(this.createGameObjectOption("Upgrade 1", "Tower/level2.svg", "Tower/bullets2.svg", 50, true));
		else if (this.m_upgrades == 1)
			options.push(this.createGameObjectOption("Upgrade 2", "Tower/level3.svg", "Tower/bullets3.svg", 100, true));

		options.push({
			title: "50$ - Repair",
			isAvailable: this.getHealth() < GameObject.MaxHealth,
			getPrice: () => { return 50; },
			execute: () => {
				this.setHealth(GameObject.MaxHealth);
			}
		});

		return options;
	}

	public spawnBullet = (): Bullet => new Bullet(this.m_bulletSvg, this.m_attackDamage, this.m_attackSpeed);

	public getBulletSvgName = (): string => this.m_bulletSvg;
	public getAttackSpeed = (): number => this.m_attackSpeed;
	public getAttackDamage = (): number => this.m_attackDamage;
}
