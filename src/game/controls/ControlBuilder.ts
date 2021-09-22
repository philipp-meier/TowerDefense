/*
	=== Control Builder ===
	Creates DOM elements and provides helper methods.
*/
import { GameBoard } from "../GameBoard.js";
import { GameObject, GameObjectBase } from "../gameObjects/GameObjectBase.js";
import { Rampart, Tower } from "../gameObjects/PlayerObjects.js";
import { IRenderableObject, IRenderableText } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";

export class ControlBuilder {
	public static CssUnit = 'px';

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
		const container = ControlBuilder.createObject(textObj);
		ControlBuilder.createSpan(container, textObj.text, null);
		return container;
	}

	public static createGameBoard(gameBoard: GameBoard): HTMLElement {
		const gameBoardContainer = ControlBuilder.createObject({ cssClass: "game-board", width: AppConfig.fieldWidth, height: AppConfig.fieldHeight });

		ControlBuilder.createGameBoardGridLayer(gameBoardContainer, gameBoard, "background", true).classList.add("layer");
		ControlBuilder.createDiv(gameBoardContainer, "game-object-layer").classList.add("layer");
		ControlBuilder.createGameBoardGridLayer(gameBoardContainer, gameBoard, "interaction").classList.add("layer");

		return gameBoardContainer;
	}
	private static createGameBoardGridLayer(parent: HTMLElement, gameBoard: GameBoard, typeName: string, structureOnly = false): HTMLDivElement {
		const gameFields = gameBoard.GameFields();
		const fieldHeight = AppConfig.fieldHeight / AppConfig.rowCount;
		const fieldWidth = AppConfig.fieldWidth / AppConfig.columnCount;

		const gridLayerContainer = ControlBuilder.createDiv(parent, `${typeName}-layer`);
		for (let i = 0; i < gameFields.length; i++) {
			for (let j = 0; j < gameFields[i].length; j++) {
				const gameField = gameFields[i][j];
				const gameFieldObject = ControlBuilder.createObject({ cssClass: `${typeName}-field`, width: fieldWidth, height: fieldHeight });
				gameFieldObject.style.left = ControlBuilder.getUnitString(j * fieldWidth);
				gameFieldObject.style.top = ControlBuilder.getUnitString(i * fieldHeight);

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
		const selectionBar = ControlBuilder.createDiv(null, renderInfo.cssClass);
		ControlBuilder.SetPosition(selectionBar, renderInfo);

		const templateObjects = [new Tower(), new Rampart()];
		for (let i = 0; i < templateObjects.length; i++) {
			const templateObject = templateObjects[i];
			const selectionDiv = ControlBuilder.createDiv(selectionBar, "selection-item");
			ControlBuilder.createDiv(selectionDiv, "price").innerText = `${templateObject.getPrice()}$`;

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

	public static createGameObject(fromElement: HTMLDivElement, gameObject: GameObjectBase, className: string, offsetLeft: number | null = null): HTMLDivElement {
		const gameObjectDiv = ControlBuilder.createDiv(null, className);
		gameObjectDiv.style.backgroundImage = `url('${AppConfig.svgPath}${gameObject.getSvg()}')`;
		gameObjectDiv.style.height = ControlBuilder.getUnitString(AppConfig.fieldHeight / AppConfig.rowCount);
		gameObjectDiv.style.width = ControlBuilder.getUnitString(AppConfig.fieldWidth / AppConfig.columnCount);
		gameObjectDiv.dataset.gameObjectId = gameObject.getID().toString();
		gameObjectDiv.style.top = fromElement.style.top;

		if (offsetLeft)
			gameObjectDiv.style.left = ControlBuilder.addToUnitString(fromElement.style.left, offsetLeft);
		else
			gameObjectDiv.style.left = fromElement.style.left;

		if (gameObject instanceof GameObject)
			ControlBuilder.createHealthBar(gameObjectDiv);

		return gameObjectDiv;
	}

	public static createHealthBar(parent: HTMLDivElement): HTMLDivElement {
		const healthBarContainer = ControlBuilder.createDiv(parent, 'health-bar');
		const healthBarValue = ControlBuilder.createDiv(healthBarContainer, 'value');
		healthBarValue.style.width = '100%';

		healthBarContainer.style.width = ControlBuilder.getUnitString(AppConfig.fieldWidth / AppConfig.columnCount);
		healthBarContainer.style.height = ControlBuilder.getUnitString(8);
		healthBarContainer.style.position = 'absolute';
		return healthBarContainer;
	}

	public static createObject(obj: IRenderableObject): HTMLElement {
		const container = ControlBuilder.createDiv(null, obj.cssClass);
		ControlBuilder.SetPosition(container, obj);
		return container;
	}
	public static SetPosition(element: HTMLElement, ro: IRenderableObject): void {
		element.style.width = ControlBuilder.getUnitString(ro.width);
		element.style.height = ControlBuilder.getUnitString(ro.height);
	}
	private static addToUnitString(unitString: string, value: number): string {
		const currentValue = ControlBuilder.getNumberWithoutUnit(unitString);
		return ControlBuilder.getUnitString(currentValue + value);
	}
	public static getNumberWithoutUnit(unitText: string): number {
		return Number(unitText.replace(ControlBuilder.CssUnit, ''));
	}
	public static getUnitString(n: number): string {
		return `${n}${ControlBuilder.CssUnit}`;
	}
}
