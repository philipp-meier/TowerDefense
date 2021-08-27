import { IGameField } from "./Interfaces.js";

export class GameBoard {
	public GameFields: IGameField[][];

	constructor(rowCount: number, columnCount: number) {
		this.GameFields = this.createGameFieldArray(rowCount, columnCount);
	}

	private createGameFieldArray(rowCount: number, columnCount: number): IGameField[][] {
		let singleFields: IGameField[][] = [];

		let fieldID = 1;
		for (let i = 0; i < rowCount; i++) {
			singleFields[i] = [];
			for (let j = 0; j < columnCount; j++) {
				singleFields[i][j] = { id: fieldID++, gameObject: null };
			}
		}
		return singleFields;
	}
}
