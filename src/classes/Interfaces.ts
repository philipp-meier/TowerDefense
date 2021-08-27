export interface IAppConfig {
	appTitle: string;
	fieldWidth: number;
	fieldHeight: number;
	rowCount: number;
	columnCount: number;
	svgPath: string;
}

export interface IUIService {
	showMessage(message: string): void;
	renderObject(obj: IRenderableObject): void;
	renderText(textObj: IRenderableText): void;
}

export interface IGameField {
	id: number;
	gameObject: IGameObject | null;
}

export interface IRenderableObject {
	cssClass: string;
	x: number;
	y: number;
	height: number;
	width: number;
}
export interface IRenderableText extends IRenderableObject {
	text: string;
}

export interface IGameObjectOption {
	title: string;
	execute(): void;
}
export interface IGameObject {
	id: number;
	health: number;
	armor: number;
	damage: number;
	attackSpeed: number;
	field: IGameField | null;
	getOptions(): IGameObjectOption[]
	placeObject(field: IGameField): void;
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
