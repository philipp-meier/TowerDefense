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
import { HtmlInputService } from "./HtmlInputService.js";

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

		HtmlInputService.registerHandlers(container, this);
	}

	public refreshUI(): void {
		this.m_htmlPlayerStatusBar.refreshPlayerStatusBar(this.m_game.getPlayerStatusInfo());
	}

	public addGameObject(target: never): void {
		try {
			const tower = new Tower();
			this.m_game.buyGameObject(tower);
			this.renderGameObject(tower, <HTMLDivElement>target);
		} catch (ex) {
			this.renderMessage((<Error>ex).message);
		}
	}
	public showContextMenu(gameObjectID: number, posX: number, posY: number): void {
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
					this.renderMessage((<Error>ex).message);
				}
			};

			this.m_htmlContextMenu.show(gameObject, posX, posY, execGameObjectOption);
		}
	}
	public hideContextMenu(): void {
		this.m_htmlContextMenu.hide();
	}

	public renderMessage(message: string): void {
		this.m_htmlMessageBox.show('Message', message);
	}
	public renderObject(obj: IRenderableObject): void {
		this.m_parentContainer.append(HtmlControlBuilder.createObject(obj));
	}

	public renderAppTitle(title: string): void {
		this.renderText({ cssClass: "app-title", width: AppConfig.fieldWidth, height: 25, text: title });
	}
	public renderText(textObj: IRenderableText): void {
		this.m_parentContainer.append(HtmlControlBuilder.createText(textObj));
	}

	public renderGameBoard(gameBoard: GameBoard): void {
		this.m_parentContainer.append(HtmlControlBuilder.createGameBoard(gameBoard));
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
