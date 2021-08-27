import { IGameObject, IGameObjectOption, IGameField, IUpgradableGameObject } from "./Interfaces.js";

export class Tower implements IUpgradableGameObject {
	static currentId: number = 1;

	id: number;
	health: number = 100;
	armor: number = 0;
	damage: number = 15;
	attackSpeed: number = 1;
	upgrades: IGameObject[] = [];
	field: IGameField | null = null;

	constructor() {
		this.id = Tower.currentId++;
	}

	getOptions(): IGameObjectOption[] {
		throw new Error("Method not implemented.");
	}
	placeObject(field: IGameField): void {
		this.field = field;
	}
}
