import { Bullet } from "../classes/Bullet.js";
import { GameBoard } from "../classes/GameBoard.js";
import { IRenderableObject, IRenderableText } from "../Interfaces.js";
import { AppConfig } from "./AppService.js";

export class HtmlControlBuilder {
	private static m_cssUnit = 'px';

	private static createHtmlElement(tagName: string, parent: HTMLElement | null = null, cssClass: string | null = null) {
		const htmlElement = document.createElement(tagName);

		if (cssClass)
			htmlElement.className = cssClass;

		if (parent)
			parent.append(htmlElement);

		return htmlElement;
	}
	public static createDiv(parent: HTMLElement | null = null, cssClass: string | null = null): HTMLDivElement {
		return <HTMLDivElement>this.createHtmlElement('div', parent, cssClass);
	}

	public static createUListElement(parent: HTMLElement | null, cssClass: string | null = null): HTMLUListElement {
		return <HTMLUListElement>this.createHtmlElement('ul', parent, cssClass);
	}
	public static createListElement(parent: HTMLElement | null, cssClass: string | null): HTMLLIElement {
		return <HTMLLIElement>this.createHtmlElement('li', parent, cssClass);
	}

	public static createSpan(parent: HTMLElement, text: string, cssClass: string | null = null): HTMLSpanElement {
		const span = <HTMLSpanElement>this.createHtmlElement('span', parent, cssClass);
		span.textContent = text;

		return span;
	}
	public static createLinkButton(parent: HTMLElement, cssClass: string | null, onClick: VoidFunction): HTMLAnchorElement {
		const linkButton = <HTMLAnchorElement>this.createHtmlElement('a', parent, cssClass);
		linkButton.onclick = onClick;
		return linkButton;
	}
	public static createButton(parent: HTMLElement, text: string, onClick: VoidFunction): HTMLButtonElement {
		const btn = <HTMLButtonElement>this.createHtmlElement('button', parent);
		btn.type = "button";
		btn.textContent = text;
		btn.onclick = onClick;
		return btn;
	}

	public static createText(textObj: IRenderableText): HTMLElement {
		const container = HtmlControlBuilder.createObject(textObj);
		HtmlControlBuilder.createSpan(container, textObj.text, null);
		return container;
	}

	public static createGameBoard(field: GameBoard): HTMLElement {
		const gameFields = field.GameFields();
		const fieldContainer = HtmlControlBuilder.createObject({ cssClass: "game-board", width: AppConfig.fieldWidth, height: AppConfig.fieldHeight });
		const fieldHeight = AppConfig.fieldHeight / AppConfig.rowCount;
		const fieldWidth = AppConfig.fieldWidth / AppConfig.columnCount;

		for (let i = 0; i < gameFields.length; i++) {
			for (let j = 0; j < gameFields[i].length; j++) {
				const gameField = gameFields[i][j];
				const gameFieldObject = HtmlControlBuilder.createObject({ cssClass: "game-field", width: fieldWidth, height: fieldHeight });
				gameFieldObject.style.left = HtmlControlBuilder.getUnitString(j * fieldWidth);
				gameFieldObject.style.top = HtmlControlBuilder.getUnitString(i * fieldHeight);
				gameFieldObject.dataset.fieldId = gameField.id.toString();
				fieldContainer.append(gameFieldObject);
			}
		}
		return fieldContainer;
	}

	public static createBullet(fromElement: HTMLDivElement, bullet: Bullet): HTMLDivElement {
		const bulletDiv = <HTMLDivElement>document.createElement('div');
		bulletDiv.className = 'bullet';
		bulletDiv.style.backgroundImage = `url('${AppConfig.svgPath}${bullet.getSvg()}')`;
		bulletDiv.style.height = AppConfig.fieldHeight / AppConfig.rowCount + 'px';
		bulletDiv.style.width = AppConfig.fieldWidth / AppConfig.columnCount + 'px';
		bulletDiv.style.top = fromElement.style.top;
		bulletDiv.style.left = fromElement.style.left;
		bulletDiv.dataset.gameObjectId = bullet.getID().toString();
		return bulletDiv;
	}

	public static createObject(obj: IRenderableObject): HTMLElement {
		const container = <HTMLDivElement>this.createDiv(null, obj.cssClass);
		HtmlControlBuilder.SetPosition(container, obj);
		return container;
	}
	public static SetPosition(element: HTMLElement, ro: IRenderableObject): void {
		element.style.width = HtmlControlBuilder.getUnitString(ro.width);
		element.style.height = HtmlControlBuilder.getUnitString(ro.height);
	}
	public static getUnitString(n: number): string {
		return `${n}${HtmlControlBuilder.m_cssUnit}`;
	}
}
