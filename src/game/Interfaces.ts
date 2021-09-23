import { Bullet } from "./gameObjects/Bullet.js";
import { EnemyBase } from "./gameObjects/Enemies.js";
import { GameBoard } from "./GameBoard.js";
import { GameObject } from "./gameObjects/GameObjectBase.js";

export interface IUIService {
	renderObject(obj: IRenderableObject): void;
	renderText(textObj: IRenderableText): void;
	renderAppTitle(title: string): void;
	renderPlayerStatusBar(statusInfo: IPlayerStatusInfo): void;
	renderGameObjectSelectionBar(): void;
	renderGameBoard(gameBoard: GameBoard): void;
	renderMessageWithTitle(title: string, message: string): Promise<void>;
	renderMessage(message: string): Promise<void>;
	registerInteractionHandlers(): void;
	renderBullet(from: GameObject, bullet: Bullet): void;
	renderEnemy(enemy: EnemyBase): void;
	addGameObject(target: HTMLDivElement): void;
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

// Modifications
export interface IShootingGameObject extends IAttackingGameObject {
	spawnBullet(): Bullet;
}
