import { IGameObject, IUpgradableGameObject } from "./Interfaces";

export class Tower implements IUpgradableGameObject {
	upgrades: IGameObject[] = [];
	svgName: string = "tower_base";
	health: number = 100;
	armor: number = 0;
	damage: number = 15;
	attackSpeed: number = 1;

	constructor() { }
}
