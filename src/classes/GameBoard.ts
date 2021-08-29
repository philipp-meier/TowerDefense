import { IGameField } from "../Interfaces.js";

export class GameBoard {
	private m_GameFields: IGameField[][];

	constructor(rowCount: number, columnCount: number) {
		this.m_GameFields = this.createGameFieldArray(rowCount, columnCount);
	}

	private createGameFieldArray(rowCount: number, columnCount: number): IGameField[][] {
		let gameFields: IGameField[][] = [];

		let fieldID = 1;
		for (let i = 0; i < rowCount; i++) {
			gameFields[i] = [];
			for (let j = 0; j < columnCount; j++) {
				gameFields[i][j] = { id: fieldID++, gameObject: null };
			}
		}
		return gameFields;
	}

	public GameFields(): IGameField[][] {
		return this.m_GameFields;
	}
}
