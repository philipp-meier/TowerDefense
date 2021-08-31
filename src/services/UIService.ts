import { GameBoard } from "../classes/GameBoard.js";
import { AppConfig } from "./AppService.js";
import { IGameObject, IGameObjectOption, IPlayerStatusBar, IRenderableObject, IRenderableText, IUIService } from "../Interfaces.js"
import { Tower } from "../classes/Tower.js";
import { HtmlContextMenu } from "../controls/HtmlContextMenu.js";
import { Game } from "../classes/Game.js";
import { GameFieldService } from "./GameFieldService.js";
import { HtmlMessageBox } from "../controls/HtmlMessageBox.js";
import { HtmlControlBuilder } from "./HtmlControlBuilder.js";

export class UIService implements IUIService {

	private readonly m_parentContainer: HTMLDivElement;
	private readonly m_game: Game;
	private m_htmlContextMenu: HtmlContextMenu;
	private m_htmlMessageBox: HtmlMessageBox;

	constructor(container: HTMLDivElement, game: Game) {
		this.m_parentContainer = container;
		this.m_htmlContextMenu = new HtmlContextMenu(container);
		this.m_htmlMessageBox = new HtmlMessageBox(container);

		this.m_game = game;
		this.registerHandlers();

		// Start update loop
		let prevTime = 0.0;
		const updateLoop = (time: number) => {
			prevTime = time;

			// Updates
			this.refreshPlayerStatusBar();

			window.requestAnimationFrame(updateLoop);
		}
		updateLoop(prevTime);
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
					this.m_game.addBuyableGameObject(tower);
					this.renderGameObject(tower, <HTMLDivElement>target);
				} catch (ex) {
					this.showMessage(ex.message);
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
						this.showMessage(ex.message);
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

	public renderPlayerStatusBar(statusBar: IPlayerStatusBar): void {
		const container = HtmlControlBuilder.createDiv(this.m_parentContainer, statusBar.cssClass);
		HtmlControlBuilder.SetPosition(container, statusBar);

		const healthContainer = this.renderPlayerStatusBarItem(`${AppConfig.svgPath}/StatusBar/health.svg`, statusBar.getHealth(), "health");
		const coinContainer = this.renderPlayerStatusBarItem(`${AppConfig.svgPath}/StatusBar/coin.svg`, statusBar.getCoins(), "coins");

		container.append(healthContainer);
		container.append(coinContainer);
	}
	private renderPlayerStatusBarItem(svgPath: string, value: number, className: string): HTMLDivElement {
		const container = HtmlControlBuilder.createDiv(null, className);

		const imgDiv = HtmlControlBuilder.createDiv(container, "icon");
		imgDiv.style.backgroundImage = `url('${svgPath}')`;

		HtmlControlBuilder.createSpan(container, value.toString(), null);
		return container;
	}
	private refreshPlayerStatusBar(): void {
		const playerStatusBar = this.m_game.getPlayerStatusBar();
		const healthSpan = document.querySelector(`div.${playerStatusBar.cssClass} div.health span`);
		if (healthSpan && healthSpan instanceof HTMLSpanElement)
			healthSpan.textContent = playerStatusBar.getHealth().toString();

		const coinSpan = document.querySelector(`div.${playerStatusBar.cssClass} div.coins span`);
		if (coinSpan && coinSpan instanceof HTMLSpanElement)
			coinSpan.textContent = playerStatusBar.getCoins().toString();
	}
}
