/*
	=== Game Board ===
	Creates the game board structure according to the GameSettings.
*/
import { IGameField } from "./Interfaces.js";

export class GameBoard {
	private m_GameFields: IGameField[][];

	constructor(rowCount: number, columnCount: number) {
		this.m_GameFields = this.createGameFieldArray(rowCount, columnCount);
	}

	private createGameFieldArray(rowCount: number, columnCount: number): IGameField[][] {
		const gameFields: IGameField[][] = [];

		let fieldID = 1;
		for (let i = 0; i < rowCount; i++) {
			gameFields[i] = [];
			for (let j = 0; j < columnCount; j++) {
				gameFields[i][j] = { id: fieldID++, gameObject: null };
			}
		}
		return gameFields;
	}

	public GameFields = (): IGameField[][] => this.m_GameFields;
}
