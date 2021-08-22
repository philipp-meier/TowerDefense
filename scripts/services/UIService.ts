import { IRenderableObject, IRenderableText, IStylableObject, IUIService } from "../classes/Interfaces"

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
		this.parentContainer.append(this.createObject(obj));
	}
	private createObject(obj: IRenderableObject): HTMLElement {
		const container = <HTMLDivElement>document.createElement('div');

		this.AppendCssClass(container, obj);
		this.SetPosition(container, obj);

		return container;
	}

	renderText(textObj: IRenderableText): void {
		this.parentContainer.append(this.createText(textObj));
	}
	private createText(textObj: IRenderableText): HTMLElement {
		const container = this.createObject(textObj);
		const span = <HTMLSpanElement>document.createElement('span');
		span.textContent = textObj.text;
		container.append(span);
		return container;
	}

	private SetPosition(element: HTMLElement, ro: IRenderableObject): void {
		element.style.width = this.getUnitString(ro.width);
		element.style.height = this.getUnitString(ro.height);
	}
	private AppendCssClass(element: HTMLElement, so: IStylableObject): void {
		if (so.cssClass)
			element.className = so.cssClass;
	}
	private getUnitString(n: number): string {
		return `${n}${this.cssUnit}`;
	}
}
