import { AppConfig } from "../services/AppService.js";
import { IRenderableObject, ISize, IStylableObject } from "./Interfaces.js";

export class Field implements IStylableObject, IRenderableObject {
	readonly cssClass: string;
	readonly x: number;
	readonly y: number;
	readonly height: number;
	readonly width: number;

	public SingleFields: IRenderableObject[][];

	constructor(x: number, y: number, width: number, height: number) {
		this.cssClass = "game-field";
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.SingleFields = this.createSingleFieldArray();
	}

	private createSingleFieldArray(): IRenderableObject[][] {
		const fieldSize = this.getSingleFieldSize();
		let singleFields: IRenderableObject[][] = [];

		for (let i = 0; i < AppConfig.rowCount; i++) {
			singleFields[i] = [];
			for (let j = 0; j < AppConfig.columnCount; j++) {
				singleFields[i][j] = {
					x: j * fieldSize.width,
					y: i * fieldSize.height,
					width: fieldSize.width,
					height: fieldSize.height,
					cssClass: "singleField"
				};
			}
		}
		return singleFields;
	}

	private getSingleFieldSize(): ISize {
		return {
			height: this.height / AppConfig.rowCount,
			width: this.width / AppConfig.columnCount
		};
	}
}
