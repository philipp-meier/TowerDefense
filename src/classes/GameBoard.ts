import { IGameField } from "../Interfaces.js";

export class GameBoard {
	private m_GameFields: IGameField[][];

	constructor(rowCount: number, columnCount: number) {
		this.m_GameFields = this.createGameFieldArray(rowCount, columnCount);
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

	public GameFields(): IGameField[][] {
		return this.m_GameFields;
	}
}
