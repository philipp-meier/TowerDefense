import { IGameObjectOption } from "../Interfaces.js";
import { BuyableGameObject } from "./GameObjects.js";

export class Tower extends BuyableGameObject {
	private m_upgrades = 0;

	constructor() {
		super('Tower/level1.svg', 50);
	}

	public getOptions(): IGameObjectOption[] {
		if (this.m_upgrades == 0)
			return [this.createGameObjectOption("50$ - Upgrade 1", "Tower/level2.svg", 50)];
		else if (this.m_upgrades == 1)
			return [this.createGameObjectOption("100$ - Upgrade 2", "Tower/level3.svg", 100)];
		else
			return [];
	}
	private createGameObjectOption(title: string, svgName: string, price: number): IGameObjectOption {
		return {
			title: title,
			execute: () => {
				this.m_upgrades++;
				this.m_svg = svgName
			},
			getPrice: () => { return price; }
		};
	}
}
