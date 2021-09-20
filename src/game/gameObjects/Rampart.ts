import { IGameObjectOption } from "../Interfaces.js";
import { BuyableGameObject } from "./GameObjectBase.js";

export class Rampart extends BuyableGameObject {
	constructor() {
		super('Rampart', 'Rampart/rampart.svg', 25);
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
