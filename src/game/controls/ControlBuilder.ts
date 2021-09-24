/*
	=== Control Builder ===
	Creates DOM elements and provides helper methods.
*/
import { GameBoard } from "../GameBoard.js";
import { GameObject, GameObjectBase } from "../gameObjects/GameObjectBase.js";
import { PlayerGameObjectBase } from "../gameObjects/PlayerObjects.js";
import { GameSettings } from "../GameSettings.js";
import { IRenderableObject, IRenderableText } from "../Interfaces.js";

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
		const gameBoardContainer = ControlBuilder.createObject({ cssClass: "game-board", width: GameSettings.fieldWidth, height: GameSettings.fieldHeight });

		ControlBuilder.createGameBoardGridLayer(gameBoardContainer, gameBoard, "background", true).classList.add("layer");
		ControlBuilder.createDiv(gameBoardContainer, "game-object-layer").classList.add("layer");
		ControlBuilder.createGameBoardGridLayer(gameBoardContainer, gameBoard, "interaction").classList.add("layer");

		return gameBoardContainer;
	}
	private static createGameBoardGridLayer(parent: HTMLElement, gameBoard: GameBoard, typeName: string, structureOnly = false): HTMLDivElement {
		const gameFields = gameBoard.GameFields();
		const fieldHeight = GameSettings.singleFieldHeight;
		const fieldWidth = GameSettings.singleFieldWidth;

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

	public static createGameObjectSelectionBar(selectableGameObjects: PlayerGameObjectBase[]): HTMLDivElement {
		const renderInfo = { height: 102, width: GameSettings.fieldWidth - 6, cssClass: "selection-bar" };
		const selectionBar = ControlBuilder.createDiv(null, renderInfo.cssClass);
		ControlBuilder.SetPosition(selectionBar, renderInfo);

		for (let i = 0; i < selectableGameObjects.length; i++) {
			const templateObject = selectableGameObjects[i];
			const selectionDiv = ControlBuilder.createDiv(selectionBar, "selection-item");
			ControlBuilder.createDiv(selectionDiv, "price").innerText = `${templateObject.getPrice()}$`;

			selectionDiv.dataset.classIdentifier = templateObject.getClassIdentifier();
			selectionDiv.onclick = () => {
				document.querySelectorAll('.selection-bar div.selection-item.selected').forEach(x => {
					x.classList.remove("selected");
				});
				selectionDiv.classList.add("selected");
			};
			selectionDiv.style.backgroundImage = `url('${GameSettings.svgPath}${templateObject.getSvg()}')`;

			if (i == 0)
				selectionDiv.classList.add("selected");
		}

		return selectionBar;
	}

	public static createGameObject(gameObject: GameObjectBase, className: string, offsetLeft = 0): HTMLDivElement {
		const gameObjectDiv = ControlBuilder.createDiv(null, className);
		gameObjectDiv.style.backgroundImage = `url('${GameSettings.svgPath}${gameObject.getSvg()}')`;
		gameObjectDiv.dataset.gameObjectId = gameObject.getID().toString();

		gameObjectDiv.style.height = ControlBuilder.getUnitString(GameSettings.singleFieldHeight);
		gameObjectDiv.style.width = ControlBuilder.getUnitString(GameSettings.singleFieldWidth);
		gameObjectDiv.style.top = ControlBuilder.getUnitString(gameObject.getLane() * GameSettings.singleFieldHeight);
		gameObjectDiv.style.left = ControlBuilder.getUnitString(gameObject.getPositionX() + offsetLeft);

		if (gameObject instanceof GameObject)
			ControlBuilder.createHealthBar(gameObjectDiv);

		return gameObjectDiv;
	}
	private static createHealthBar(parent: HTMLDivElement): HTMLDivElement {
		const healthBarContainer = ControlBuilder.createDiv(parent, 'health-bar');
		ControlBuilder.createDiv(healthBarContainer, 'value');

		healthBarContainer.style.width = ControlBuilder.getUnitString(GameSettings.singleFieldWidth);
		healthBarContainer.style.height = ControlBuilder.getUnitString(8);
		return healthBarContainer;
	}
	private static createObject(obj: IRenderableObject): HTMLElement {
		const container = ControlBuilder.createDiv(null, obj.cssClass);
		ControlBuilder.SetPosition(container, obj);
		return container;
	}

	public static SetPosition(element: HTMLElement, ro: IRenderableObject): void {
		element.style.width = ControlBuilder.getUnitString(ro.width);
		element.style.height = ControlBuilder.getUnitString(ro.height);
	}
	public static getNumberWithoutUnit(unitText: string): number {
		return Number(unitText.replace(ControlBuilder.CssUnit, ''));
	}
	public static getUnitString(n: number): string {
		return `${n}${ControlBuilder.CssUnit}`;
	}
	public static getGameObjectId(container: HTMLDivElement): number | null {
		if (container && container.dataset.gameObjectId)
			return parseInt(container.dataset.gameObjectId);

		return null;
	}
}
