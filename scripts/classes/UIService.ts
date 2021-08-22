import { IRenderableObject, IUIService } from "./Interfaces.js"

export class UIService implements IUIService {

	readonly parentContainer: HTMLDivElement;
	private readonly cssUnit: string = 'px';

	constructor(container: HTMLDivElement) {
		this.parentContainer = container;
	}

	showMessage(message: string): void {
		alert(message);
	}

	renderObject(obj: IRenderableObject): void {
		const container = <HTMLDivElement>document.createElement('div');

		if (obj.cssClass)
			container.className = obj.cssClass;

		container.style.width = this.getUnitString(obj.width);
		container.style.height = this.getUnitString(obj.height);

		this.parentContainer.append(container);
	}
	private getUnitString(n: number): string {
		return `${n}${this.cssUnit}`;
	}
}
