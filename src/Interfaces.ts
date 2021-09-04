import { GameBoard } from "./classes/GameBoard.js";

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
	refreshUI(): void;
	renderMessage(message: string): void;

	addGameObject(target: never): void;
}

export interface IGameField {
	id: number;
	gameObject: IGameObject | null;
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
export interface IGameObject {
	getID(): number;
	getHealth(): number;
	getArmor(): number;
	getDamage(): number;
	getAttackSpeed(): number;
	getAssignedGameField(): IGameField | null;
	getOptions(): IGameObjectOption[]
	getSvg(): string;
	placeObject(field: IGameField): void;
}
export interface IBuyableGameObject extends IGameObject, IPriced {
	placeObject(field: IGameField): void;
}
export interface IMovingGameObject extends IGameObject {
	getMovementSpeed(): number;
	getAnimationSvgNames(): string[];
}
export interface IShootingGameObject extends IGameObject {
	getBulletSvgName(): string[];
}

export interface IPlayerStatusInfo {
	health: number;
	coins: number;
}

export interface IPriced {
	getPrice(): number;
}
