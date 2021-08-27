import { GameBoard } from "../classes/GameBoard.js";
import { AppConfig } from "./AppService.js";
import { IGameObject, IRenderableObject, IRenderableText, IUIService } from "../classes/Interfaces.js"
import { Tower } from "../classes/Tower.js";
import { HtmlContextMenu } from "../controls/HtmlContextMenu.js";

export class UIService implements IUIService {

	readonly parentContainer: HTMLDivElement;
	private readonly cssUnit: string = 'px';
	private renderedGameObjects: IGameObject[] = [];
	private htmlContextMenu: HtmlContextMenu;

	constructor(container: HTMLDivElement) {
		this.parentContainer = container;
		this.htmlContextMenu = new HtmlContextMenu(container);
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
			if (target && target instanceof HTMLDivElement && target.classList.contains('singleField')) {
				const tower = new Tower();
				this.renderGameObject(tower, target);
				this.renderedGameObjects.push(tower);
			}

		});

		document.addEventListener('contextmenu', (e) => {
			e = e || window.event;
			e.preventDefault();

			const target = e.target;
			if (target && target instanceof HTMLDivElement && target.dataset.gameObjectId) {
				const gameObject = this.renderedGameObjects.find(go => go.id.toString() == target.dataset.gameObjectId);

				if (gameObject)
					this.htmlContextMenu.show(gameObject, e.pageX, e.pageY);
			}

		}, false);

		document.addEventListener('mousedown', (e) => {
			e = e || window.event;
			const target = e.target;
			if (!target || !(target instanceof HTMLAnchorElement || target instanceof HTMLSpanElement))
				this.htmlContextMenu.hide();
		})
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
		parentField.style.backgroundImage = `url('${AppConfig.svgPath}tower_base.svg')`;
		parentField.dataset.gameObjectId = `${gameObject.id}`;
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
