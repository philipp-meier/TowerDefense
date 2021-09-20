import { IAttackingGameObject } from "../Interfaces.js";
import { GameObject } from "./GameObjectBase.js";

export class Enemy extends GameObject implements IAttackingGameObject {
	private m_gameBoardLane: number;
	protected m_coins = 50;
	protected m_damage = 20;

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
