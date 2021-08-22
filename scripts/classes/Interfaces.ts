export interface IUIService {
	showMessage(message: string): void;
	renderObject(obj: IRenderableObject): void;
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
