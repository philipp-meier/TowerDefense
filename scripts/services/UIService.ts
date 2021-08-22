import { Field } from "../classes/Field.js";
import { AppConfig } from "./AppService.js";
import { IRenderableObject, IRenderableText, IStylableObject, IUIService } from "../classes/Interfaces.js"

export class UIService implements IUIService {

	readonly parentContainer: HTMLDivElement;
	private readonly cssUnit: string = 'px';

	constructor(container: HTMLDivElement) {
		this.parentContainer = container;
		this.registerHandlers();
	}

	showMessage(message: string): void {
		alert(message);
	}

	private registerHandlers(): void {
		document.addEventListener('click', (e) => {
			e = e || window.event;
			const target = e.target;

			// Just for tests.
			if (target && target instanceof HTMLDivElement)
				this.renderFieldSvg("tower_1", target);
		});
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

	renderField(field: Field): void {
		const singleFields = field.SingleFields;
		const fieldContainer = this.createObject(field);
		for (let i = 0; i < singleFields.length; i++) {
			for (let j = 0; j < singleFields[i].length; j++) {
				const singleField = this.createObject(singleFields[i][j])
				singleField.style.left = this.getUnitString(singleFields[i][j].x);
				singleField.style.top = this.getUnitString(singleFields[i][j].y);
				fieldContainer.append(singleField);
			}
		}
		this.parentContainer.append(fieldContainer);
	}

	renderFieldSvg(svgName: string, parentField: HTMLDivElement): void {
		const objContainer = <HTMLObjectElement>document.createElement('object');
		objContainer.data = `${AppConfig.svgPath}${svgName}.svg`;
		objContainer.type = "image/svg+xml";
		objContainer.width = this.getUnitString(AppConfig.fieldWidth / AppConfig.columnCount);
		objContainer.height = this.getUnitString(AppConfig.fieldHeight / AppConfig.rowCount);
		objContainer.className = "fieldSvg";
		parentField.append(objContainer);
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
