import { GameBoard } from "../classes/GameBoard.js";
import { AppConfig } from "./AppService.js";
import { IGameObject, IGameObjectOption, IPlayerStatusInfo, IRenderableObject, IRenderableText, IUIService } from "../Interfaces.js"
import { Tower } from "../classes/Tower.js";
import { HtmlContextMenu } from "../controls/HtmlContextMenu.js";
import { Game } from "../classes/Game.js";
import { GameFieldService } from "./GameFieldService.js";
import { HtmlMessageBox } from "../controls/HtmlMessageBox.js";
import { HtmlControlBuilder } from "./HtmlControlBuilder.js";
import { HtmlPlayerStatusBar } from "../controls/HtmlPlayerStatusBar.js";

export class UIService implements IUIService {

	private readonly m_parentContainer: HTMLDivElement;
	private readonly m_game: Game;
	private m_htmlContextMenu: HtmlContextMenu;
	private m_htmlMessageBox: HtmlMessageBox;
	private m_htmlPlayerStatusBar: HtmlPlayerStatusBar;

	constructor(container: HTMLDivElement, game: Game) {
		this.m_parentContainer = container;
		this.m_htmlContextMenu = new HtmlContextMenu(container);
		this.m_htmlMessageBox = new HtmlMessageBox(container);
		this.m_htmlPlayerStatusBar = new HtmlPlayerStatusBar();
		this.m_game = game;

		this.registerHandlers();
	}

	public refreshUI(): void {
		this.m_htmlPlayerStatusBar.refreshPlayerStatusBar(this.m_game.getPlayerStatusInfo());
	}

	private registerHandlers(): void {
		this.m_parentContainer.addEventListener('click', (e) => {
			e = e || window.event;
			const target = e.target;

			if (!target || !GameFieldService.isEventTargetGameField(target))
				return;

			const gameObjectID = GameFieldService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID) {
				try {
					const tower = new Tower();
					this.m_game.buyGameObject(tower);
					this.renderGameObject(tower, <HTMLDivElement>target);
				} catch (ex) {
					this.showMessage((<Error>ex).message);
				}
			}
		});

		this.m_parentContainer.addEventListener('contextmenu', (e) => {
			e = e || window.event;
			e.preventDefault();

			const target = e.target;
			const gameObjectID = target && GameFieldService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				return;

			const gameObject = this.m_game.getBuyableGameObjectById(gameObjectID);
			if (gameObject) {
				const execGameObjectOption = (gameObject: IGameObject, option: IGameObjectOption) => {
					try {
						this.m_game.buyGameObjectOption(option);
						option.execute();

						// Redraw
						const gameObjectField = GameFieldService.getGameObjectGameField(gameObject.getID());
						if (gameObjectField)
							gameObjectField.style.backgroundImage = `url('${AppConfig.svgPath}${gameObject.getSvg()}')`;
					} catch (ex) {
						this.showMessage((<Error>ex).message);
					}
				};

				this.m_htmlContextMenu.show(gameObject, e.pageX, e.pageY, execGameObjectOption);
			}
		}, false);

		this.m_parentContainer.addEventListener('mousedown', (e) => {
			e = e || window.event;
			const target = e.target;
			if (!target || !(target instanceof HTMLAnchorElement || target instanceof HTMLSpanElement))
				this.m_htmlContextMenu.hide();
		})
	}

	public showMessage(message: string): void {
		this.m_htmlMessageBox.show('Message', message);
	}
	public renderObject(obj: IRenderableObject): void {
		this.m_parentContainer.append(HtmlControlBuilder.createObject(obj));
	}

	public renderAppTitle(title: string): void {
		this.renderText({ cssClass: "app-title", width: AppConfig.fieldWidth, height: 25, text: title });
	}
	public renderText(textObj: IRenderableText): void {
		this.m_parentContainer.append(this.createText(textObj));
	}
	private createText(textObj: IRenderableText): HTMLElement {
		const container = HtmlControlBuilder.createObject(textObj);
		HtmlControlBuilder.createSpan(container, textObj.text, null);
		return container;
	}

	public renderGameBoard(field: GameBoard): void {
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
		this.m_parentContainer.append(fieldContainer);
	}

	public renderGameObject(gameObject: IGameObject, parentField: HTMLDivElement): void {
		parentField.style.backgroundImage = `url('${AppConfig.svgPath}${gameObject.getSvg()}')`;

		if (!parentField.dataset.gameObjectId)
			parentField.dataset.gameObjectId = `${gameObject.getID()}`;
	}

	public renderPlayerStatusBar(statusInfo: IPlayerStatusInfo): void {
		this.m_htmlPlayerStatusBar.createPlayerStatusBar(this.m_parentContainer, statusInfo);
	}
}
