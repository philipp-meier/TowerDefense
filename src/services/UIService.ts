import { GameBoard } from "../classes/GameBoard.js";
import { AppConfig } from "./AppService.js";
import { IGameObject, IRenderableObject, IRenderableText, IUIService } from "../classes/Interfaces.js"
import { Tower } from "../classes/Tower.js";

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
				this.renderGameObject(new Tower(), target);
		});
	}

	renderObject(obj: IRenderableObject): void {
		this.parentContainer.append(this.createObject(obj));
	}
	private createObject(obj: IRenderableObject): HTMLElement {
		const container = <HTMLDivElement>document.createElement('div');

		this.AppendCssClass(container, obj.cssClass);
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

	renderField(field: GameBoard): void {
		const singleFields = field.GameFields;
		const fieldContainer = this.createObject({ cssClass: "game-field", x: 0, y: 0, height: AppConfig.fieldHeight, width: AppConfig.fieldWidth });
		const fieldHeight = AppConfig.fieldHeight / AppConfig.rowCount;
		const fieldWidth = AppConfig.fieldWidth / AppConfig.columnCount;

		for (let i = 0; i < singleFields.length; i++) {
			for (let j = 0; j < singleFields[i].length; j++) {
				const singleField = singleFields[i][j];
				const singleFieldObject = this.createObject({ cssClass: "singleField", x: 0, y: 0, width: fieldWidth, height: fieldHeight });
				singleFieldObject.style.left = this.getUnitString(j * fieldWidth);
				singleFieldObject.style.top = this.getUnitString(i * fieldHeight);
				singleFieldObject.dataset.fieldId = singleField.id.toString();
				fieldContainer.append(singleFieldObject);
			}
		}
		this.parentContainer.append(fieldContainer);
	}

	renderGameObject(gameObject: IGameObject, parentField: HTMLDivElement): void {
		const objContainer = <HTMLObjectElement>document.createElement('object');
		objContainer.data = `${AppConfig.svgPath}tower_base.svg`;
		objContainer.type = "image/svg+xml";
		objContainer.width = this.getUnitString(AppConfig.fieldWidth / AppConfig.columnCount);
		objContainer.height = this.getUnitString(AppConfig.fieldHeight / AppConfig.rowCount);
		objContainer.className = "fieldSvg";
		objContainer.dataset.gameObjectId = `${gameObject.id}`;
		parentField.append(objContainer);
	}

	private SetPosition(element: HTMLElement, ro: IRenderableObject): void {
		element.style.width = this.getUnitString(ro.width);
		element.style.height = this.getUnitString(ro.height);
	}
	private AppendCssClass(element: HTMLElement, className: string): void {
		if (className)
			element.className = className;
	}
	private getUnitString(n: number): string {
		return `${n}${this.cssUnit}`;
	}
}
