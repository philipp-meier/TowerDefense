import { GameObject } from "./GameObjects.js";

export class Enemy extends GameObject {
	private m_gameBoardLane: number;
	private m_coins = 50;
	private m_damage = 20;

	constructor(lane: number) {
		super('Enemy/enemy1.svg');
		this.m_gameBoardLane = lane;
	}

	public getLane(): number { return this.m_gameBoardLane; }
	public getCoins(): number { return this.m_coins; }
	public getDamage(): number { return this.m_damage; }
}
