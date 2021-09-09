import { IGameObjectOption, IShootingGameObject } from "../Interfaces.js";
import { BuyableGameObject } from "./GameObjects.js";
import { Bullet } from "./Bullet.js";

export class Tower extends BuyableGameObject implements IShootingGameObject {
	private m_upgrades = 0;
	private m_bulletSvg = 'Tower/bullets1.svg';
	private m_attackSpeed = 5;
	private m_attackDamage = 50;

	constructor() {
		super('Tower/level1.svg', 50);
	}

	public getBulletSvgName(): string { return this.m_bulletSvg; }
	public getAttackSpeed(): number { return this.m_attackSpeed; }
	public getAttackDamage(): number { return this.m_attackDamage; }

	public spawnBullet(): Bullet {
		return new Bullet(this.m_bulletSvg, this.m_attackDamage, this.m_attackSpeed);
	}
	public getOptions(): IGameObjectOption[] {
		if (this.m_upgrades == 0)
			return [this.createGameObjectOption("Upgrade 1", "Tower/level2.svg", "Tower/bullets2.svg", 50)];
		else if (this.m_upgrades == 1)
			return [this.createGameObjectOption("Upgrade 2", "Tower/level3.svg", "Tower/bullets3.svg", 100)];
		else
			return [];
	}
	private createGameObjectOption(title: string, svgName: string, bulletSvgName: string, price: number): IGameObjectOption {
		return {
			title: `${price}$ - ${title}`,
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
}
