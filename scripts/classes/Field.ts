import { IRenderableObject, IStylableObject } from "./Interfaces";

export class Field implements IStylableObject, IRenderableObject {
	readonly cssClass: string;
	readonly x: number;
	readonly y: number;
	readonly height: number;
	readonly width: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.cssClass = "game-field";
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}
