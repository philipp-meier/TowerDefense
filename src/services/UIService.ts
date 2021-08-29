import { GameBoard } from "../classes/GameBoard.js";
import { AppConfig } from "./AppService.js";
import { IGameObject, IPlayerStatusBar, IRenderableObject, IRenderableText, IUIService } from "../Interfaces.js"
import { Tower } from "../classes/Tower.js";
import { HtmlContextMenu } from "../controls/HtmlContextMenu.js";
import { Game } from "../classes/Game.js";
import { GameFieldService } from "./GameFieldService.js";

export class UIService implements IUIService {

	private readonly m_parentContainer: HTMLDivElement;
	private readonly m_cssUnit: string = 'px';
	private readonly m_game: Game;
	private m_htmlContextMenu: HtmlContextMenu;

	constructor(container: HTMLDivElement, game: Game) {
		this.m_parentContainer = container;
		this.m_htmlContextMenu = new HtmlContextMenu(container);
		this.m_game = game;
		this.registerHandlers();

		// Start update loop
		let prevTime = 0.0;
		const updateLoop = (time: number) => {
			const dt = time - prevTime;
			prevTime = time;

			// Updates
			this.refreshPlayerStatusBar();

			window.requestAnimationFrame(updateLoop);
		}
		updateLoop(prevTime);
	}

	private registerHandlers(): void {
		document.addEventListener('click', (e) => {
			e = e || window.event;
			const target = e.target;

			if (!target || !GameFieldService.isEventTargetGameField(target))
				return;

			const gameObjectID = GameFieldService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID) {
				const tower = new Tower();
				this.m_game.addBuyableGameObject(tower);
				this.renderGameObject(tower, <HTMLDivElement>target);
			}
		});

		document.addEventListener('contextmenu', (e) => {
			e = e || window.event;
			e.preventDefault();

			const target = e.target;
			const gameObjectID = target && GameFieldService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				return;

			const gameObject = this.m_game.getBuyableGameObjectById(gameObjectID);
			if (gameObject)
				this.m_htmlContextMenu.show(gameObject, e.pageX, e.pageY, this.updateGameObject);
		}, false);

		document.addEventListener('mousedown', (e) => {
			e = e || window.event;
			const target = e.target;
			if (!target || !(target instanceof HTMLAnchorElement || target instanceof HTMLSpanElement))
				this.m_htmlContextMenu.hide();
		})
	}

	private updateGameObject(gameObject: IGameObject) {
		// Redraw
		const gameObjectField = GameFieldService.getGameObjectGameField(gameObject.getID());
		if (gameObjectField)
			gameObjectField.style.backgroundImage = `url('${AppConfig.svgPath}${gameObject.getSvg()}')`;
	}

	public showMessage(message: string): void {
		alert(message);
	}
	public renderObject(obj: IRenderableObject): void {
		this.m_parentContainer.append(this.createObject(obj));
	}
	private createObject(obj: IRenderableObject): HTMLElement {
		const container = <HTMLDivElement>document.createElement('div');

		this.AppendCssClass(container, obj.cssClass);
		this.SetPosition(container, obj);

		return container;
	}

	public renderText(textObj: IRenderableText): void {
		this.m_parentContainer.append(this.createText(textObj));
	}
	private createText(textObj: IRenderableText): HTMLElement {
		const container = this.createObject(textObj);
		const span = <HTMLSpanElement>document.createElement('span');
		span.textContent = textObj.text;
		container.append(span);
		return container;
	}

	public renderGameBoard(field: GameBoard): void {
		const gameFields = field.GameFields();
		const fieldContainer = this.createObject({ cssClass: "game-board", width: AppConfig.fieldWidth, height: AppConfig.fieldHeight });
		const fieldHeight = AppConfig.fieldHeight / AppConfig.rowCount;
		const fieldWidth = AppConfig.fieldWidth / AppConfig.columnCount;

		for (let i = 0; i < gameFields.length; i++) {
			for (let j = 0; j < gameFields[i].length; j++) {
				const gameField = gameFields[i][j];
				const gameFieldObject = this.createObject({ cssClass: "game-field", width: fieldWidth, height: fieldHeight });
				gameFieldObject.style.left = this.getUnitString(j * fieldWidth);
				gameFieldObject.style.top = this.getUnitString(i * fieldHeight);
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
		const container = document.createElement('div');
		this.AppendCssClass(container, statusBar.cssClass);
		this.SetPosition(container, statusBar);

		const healthContainer = this.renderPlayerStatusBarItem(`${AppConfig.svgPath}/StatusBar/health.svg`, statusBar.getHealth(), "health");
		const coinContainer = this.renderPlayerStatusBarItem(`${AppConfig.svgPath}/StatusBar/coin.svg`, statusBar.getCoins(), "coins");

		container.append(healthContainer);
		container.append(coinContainer);
		this.m_parentContainer.append(container);
	}
	private renderPlayerStatusBarItem(svgPath: string, value: number, className: string): HTMLDivElement {
		const container = document.createElement('div');

		if (className)
			container.className = className;

		const imgDiv = document.createElement('div');
		imgDiv.style.backgroundImage = `url('${svgPath}')`;
		imgDiv.className = "icon";

		const spanDiv = document.createElement('span');
		spanDiv.textContent = value.toString();

		container.append(imgDiv);
		container.append(spanDiv);
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

	private SetPosition(element: HTMLElement, ro: IRenderableObject): void {
		element.style.width = this.getUnitString(ro.width);
		element.style.height = this.getUnitString(ro.height);
	}
	private AppendCssClass(element: HTMLElement, className: string): void {
		if (className)
			element.className = className;
	}
	private getUnitString(n: number): string {
		return `${n}${this.m_cssUnit}`;
	}
}
