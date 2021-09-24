/*
	=== Interfaces ===
	Contains all game relevant interfaces.
*/
import { Bullet } from "./gameObjects/Bullet.js";
import { GameObject } from "./gameObjects/GameObjectBase.js";

export interface IUIService {
	ensureScreenSizeSupported(showMessageOnFail: boolean): boolean;
	init(): void;
	registerInteractionHandlers(): void;
	renderMessageWithTitle(title: string, message: string): Promise<void>;
	renderMessage(message: string): Promise<void>;
	refreshUI(): void;
}

export interface IGameField {
	id: number;
	gameObject: GameObject | null;
}

export interface IRenderableObject {
	cssClass: string;
	height: number;
	width: number;
}
export interface IRenderableText extends IRenderableObject {
	text: string;
}

export interface IGameObjectOption extends IPricedObject {
	title: string;
	isAvailable: boolean;
	execute(): void;
}

export interface IPlayerStatusInfo {
	health: number;
	coins: number;
	startTime: number;
	currentWave: number;
}

export interface IPricedObject {
	getPrice(): number;
}

export interface IAttackingGameObject {
	getAttackSpeed(): number;
	getAttackDamage(): number;
}
export interface IShootingGameObject extends IAttackingGameObject {
	isBulletSpawnable(): boolean;
	spawnBullet(): Bullet;
}
