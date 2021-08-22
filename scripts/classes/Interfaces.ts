export interface IUIService {
	showMessage(message: string): void;
	renderObject(obj: IRenderableObject): void;
	renderText(textObj: IRenderableText): void;
}

export interface IStylableObject {
	cssClass: string;
}

export interface IRenderableObject extends IStylableObject {
	x: number;
	y: number;
	height: number;
	width: number;
}

export interface IRenderableText extends IRenderableObject {
	text: string;
}

export interface ISize {
	width: number;
	height: number;
}

export interface IAppConfig {
	appTitle: string;
	fieldWidth: number;
	fieldHeight: number;
	rowCount: number;
	columnCount: number;
	svgPath: string;
}

export interface IGameObject {
	svgName: string;
	health: number;
	armor: number;
	damage: number;
	attackSpeed: number;
}
export interface IMovingGameObject extends IGameObject {
	movementSpeed: number;
	animationSvgNames: string[];
}
export interface IUpgradableGameObject extends IGameObject {
	upgrades: IGameObject[];
}
export interface IShootingGameObject extends IGameObject {
	bulletSvgName: string[];
}
