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
	showMessage(message: string): void;
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
	getID(): number;
	getHealth(): number;
	getArmor(): number;
	getDamage(): number;
	getAttackSpeed(): number;
	getAssignedGameField(): IGameField | null;
	getOptions(): IGameObjectOption[]
	placeObject(field: IGameField): void;
}
export interface IMovingGameObject extends IGameObject {
	getMovementSpeed(): number;
	getAnimationSvgNames(): string[];
}
export interface IUpgradableGameObject extends IGameObject {
	getUpgrades(): IGameObject[];
}
export interface IShootingGameObject extends IGameObject {
	getBulletSvgName(): string[];
}
