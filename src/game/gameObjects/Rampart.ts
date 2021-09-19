import { IGameObjectOption } from "../Interfaces.js";
import { BuyableGameObject, GameObject } from "./GameObjectBase.js";

export class Rampart extends BuyableGameObject {
	constructor() {
		super('Rampart', 'Rampart/rampart.svg', 25);
	}

	public getOptions = (): IGameObjectOption[] => {
		const options: IGameObjectOption[] = [];
		options.push({
			title: "25$ - Repair",
			isAvailable: this.getHealth() < GameObject.MaxHealth,
			getPrice: () => { return 25; },
			execute: () => {
				this.setHealth(GameObject.MaxHealth);
			}
		});

		return options;
	}
}
