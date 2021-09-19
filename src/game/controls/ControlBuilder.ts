import { GameBoard } from "../GameBoard.js";
import { GameObject, GameObjectBase } from "../gameObjects/GameObjectBase.js";
import { Rampart } from "../gameObjects/Rampart.js";
import { Tower } from "../gameObjects/Tower.js";
import { IRenderableObject, IRenderableText } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";

export class HtmlControlBuilder {
	private static m_cssUnit = 'px';

	public static createHtmlElement(tagName: string, parent: HTMLElement | null = null, cssClass: string | null = null): HTMLElement {
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

	public static createGameBoard(gameBoard: GameBoard): HTMLElement {
		const gameBoardContainer = HtmlControlBuilder.createObject({ cssClass: "game-board", width: AppConfig.fieldWidth, height: AppConfig.fieldHeight });

		HtmlControlBuilder.createGameBoardGridLayer(gameBoardContainer, gameBoard, "background", true);
		HtmlControlBuilder.createDiv(gameBoardContainer, "game-object-layer");
		HtmlControlBuilder.createGameBoardGridLayer(gameBoardContainer, gameBoard, "interaction");

		return gameBoardContainer;
	}
	private static createGameBoardGridLayer(parent: HTMLElement, gameBoard: GameBoard, typeName: string, structureOnly = false): HTMLDivElement {
		const gameFields = gameBoard.GameFields();
		const fieldHeight = AppConfig.fieldHeight / AppConfig.rowCount;
		const fieldWidth = AppConfig.fieldWidth / AppConfig.columnCount;

		const gridLayerContainer = HtmlControlBuilder.createDiv(parent, `${typeName}-layer`);
		for (let i = 0; i < gameFields.length; i++) {
			for (let j = 0; j < gameFields[i].length; j++) {
				const gameField = gameFields[i][j];
				const gameFieldObject = HtmlControlBuilder.createObject({ cssClass: `${typeName}-field`, width: fieldWidth, height: fieldHeight });
				gameFieldObject.style.left = HtmlControlBuilder.getUnitString(j * fieldWidth);
				gameFieldObject.style.top = HtmlControlBuilder.getUnitString(i * fieldHeight);

				if (!structureOnly) {
					gameFieldObject.dataset.fieldId = gameField.id.toString();
					gameFieldObject.dataset.lane = i.toString();

					if (j + 1 == gameFields[i].length)
						gameFieldObject.classList.add('last');
				}

				gridLayerContainer.append(gameFieldObject);
			}
		}
		return gridLayerContainer;
	}

	public static createGameObjectSelectionbar(): HTMLDivElement {
		const renderInfo = { height: 102, width: AppConfig.fieldWidth - 6, cssClass: "selection-bar" };
		const selectionBar = HtmlControlBuilder.createDiv(null, renderInfo.cssClass);
		HtmlControlBuilder.SetPosition(selectionBar, renderInfo);

		const templateObjects = [new Tower(), new Rampart()];
		for (let i = 0; i < templateObjects.length; i++) {
			const templateObject = templateObjects[i];
			const selectionDiv = HtmlControlBuilder.createDiv(selectionBar, "selection-item");
			HtmlControlBuilder.createDiv(selectionDiv, "price").innerText = `${templateObject.getPrice()}$`;

			selectionDiv.dataset.identifier = templateObject.identifier;
			selectionDiv.onclick = () => {
				document.querySelectorAll('.selection-bar div.selection-item.selected').forEach(x => {
					x.classList.remove("selected");
				});
				selectionDiv.classList.add("selected");
			};
			selectionDiv.style.backgroundImage = `url('${AppConfig.svgPath}${templateObject.getSvg()}')`;

			if (i == 0)
				selectionDiv.classList.add("selected");
		}

		return selectionBar;
	}

	public static createGameObject(fromElement: HTMLDivElement, gameObject: GameObjectBase, className: string): HTMLDivElement {
		const gameObjectDiv = HtmlControlBuilder.createDiv(null, className);
		gameObjectDiv.style.backgroundImage = `url('${AppConfig.svgPath}${gameObject.getSvg()}')`;
		gameObjectDiv.style.height = AppConfig.fieldHeight / AppConfig.rowCount + 'px';
		gameObjectDiv.style.width = AppConfig.fieldWidth / AppConfig.columnCount + 'px';
		gameObjectDiv.style.top = fromElement.style.top;
		gameObjectDiv.style.left = fromElement.style.left;
		gameObjectDiv.dataset.gameObjectId = gameObject.getID().toString();

		if (gameObject instanceof GameObject)
			HtmlControlBuilder.createHealthBar(gameObjectDiv);

		return gameObjectDiv;
	}

	public static createHealthBar(parent: HTMLDivElement): HTMLDivElement {
		const healthBarContainer = HtmlControlBuilder.createDiv(parent, 'health-bar');
		const healthBarValue = HtmlControlBuilder.createDiv(healthBarContainer, 'value');
		healthBarValue.style.width = '100%';

		healthBarContainer.style.width = AppConfig.fieldWidth / AppConfig.columnCount + 'px';
		healthBarContainer.style.height = 8 + 'px';
		healthBarContainer.style.position = 'absolute';
		return healthBarContainer;
	}

	public static createObject(obj: IRenderableObject): HTMLElement {
		const container = HtmlControlBuilder.createDiv(null, obj.cssClass);
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
