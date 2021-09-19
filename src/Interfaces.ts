import { Bullet } from "./classes/Bullet.js";
import { Enemy } from "./classes/Enemy.js";
import { GameBoard } from "./classes/GameBoard.js";
import { GameObject } from "./classes/GameObjects.js";

export interface IAppConfig {
	appTitle: string;
	fieldWidth: number;
	fieldHeight: number;
	rowCount: number;
	columnCount: number;
	svgPath: string;
}

export interface IUIService {
	renderObject(obj: IRenderableObject): void;
	renderText(textObj: IRenderableText): void;
	renderAppTitle(title: string): void;
	renderPlayerStatusBar(statusInfo: IPlayerStatusInfo): void;
	renderGameBoard(gameBoard: GameBoard): void;
	renderMessageWithTitle(title: string, message: string): Promise<void>;
	renderMessage(message: string): Promise<void>;
	registerInteractionHandlers(): void;
	renderBullet(from: GameObject, bullet: Bullet): void;
	renderEnemy(enemy: Enemy): void;
	addGameObject(target: never): void;
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

export interface IGameObjectOption extends IPriced {
	title: string;
	execute(): void;
}

export interface IPlayerStatusInfo {
	health: number;
	coins: number;
}

export interface IPriced {
	getPrice(): number;
}

export interface IAttackGameObject {
	getAttackSpeed(): number;
	getAttackDamage(): number;
}

// Modifications
export interface IShootingGameObject extends IAttackGameObject {
	getBulletSvgName(): string;
	spawnBullet(): Bullet;
}
