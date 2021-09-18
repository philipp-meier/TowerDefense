import { IAttackGameObject } from "../Interfaces.js";
import { GameObject } from "./GameObjects.js";

export class Enemy extends GameObject implements IAttackGameObject {
	private m_gameBoardLane: number;
	private m_coins = 50;
	private m_damage = 20;

	constructor(lane: number) {
		super('Enemy/enemy1.svg');
		this.m_gameBoardLane = lane;
	}

	public getLane = (): number => this.m_gameBoardLane;
	public getCoins = (): number => this.m_coins;
	public getAttackDamage = (): number => this.m_damage;
	public getAttackSpeed = (): number => { throw new Error('Not supported'); }
	public getMoveSpeed = (): number => 1;
}
