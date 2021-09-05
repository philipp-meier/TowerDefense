import { GameBoard } from "../classes/GameBoard.js";
import { AppConfig } from "./AppService.js";
import { IGameObjectOption, IPlayerStatusInfo, IRenderableObject, IRenderableText, IUIService } from "../Interfaces.js"
import { Tower } from "../classes/Tower.js";
import { HtmlContextMenu } from "../controls/HtmlContextMenu.js";
import { Game } from "../classes/Game.js";
import { GameFieldService } from "./GameFieldService.js";
import { HtmlMessageBox } from "../controls/HtmlMessageBox.js";
import { HtmlControlBuilder } from "./HtmlControlBuilder.js";
import { HtmlPlayerStatusBar } from "../controls/HtmlPlayerStatusBar.js";
import { HtmlInputService } from "./HtmlInputService.js";
import { GameObject } from "../classes/GameObjects.js";
import { Bullet } from "../classes/Bullet.js";
import { Enemy } from "../classes/Enemy.js";

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
		this.m_game.getSpawnedBullets().forEach((bullet) => {
			const bulletDiv = GameFieldService.getGameObjectDivElement(bullet.getID());
			if (bulletDiv) {
				const left = Number(bulletDiv.style.left.replace('px', ''));
				const width = Number(bulletDiv.style.width.replace('px', ''));
				if ((left + width) >= AppConfig.fieldWidth) {
					this.m_game.removeBullet(bullet);
					document.querySelector('.game-field')?.removeChild(bulletDiv);
				} else {
					bulletDiv.style.left = (left + bullet.getSpeed()) + 'px';
				}
			}
		});

		this.m_game.getSpawnedEnemies().forEach((enemy) => {
			const enemyDiv = GameFieldService.getGameObjectDivElement(enemy.getID());
			if (enemyDiv) {
				const left = Number(enemyDiv.style.left.replace('px', ''));
				// TODO: Intersects with game object (= damage)
				if (left <= 0) {
					this.m_game.removeEnemy(enemy);
					document.querySelector('.game-field')?.removeChild(enemyDiv);
				} else {
					// TODO: Speed
					enemyDiv.style.left = (left - 1) + 'px';
				}
			}
		});

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
	public renderEnemy(enemy: Enemy): void {
		const spawnDiv = <HTMLDivElement>document.querySelector(`div.last[data-lane='${enemy.getLane()}']`);
		const gameBoard = <HTMLDivElement>document.querySelector('.game-field');
		gameBoard.append(HtmlControlBuilder.createMovingGameObject(spawnDiv, enemy, 'enemy'));
	}
	public renderBullet(from: GameObject, bullet: Bullet): void {
		const gameObjectField = <HTMLDivElement>GameFieldService.getGameObjectDivElement(from.getID());
		const gameBoard = <HTMLDivElement>document.querySelector('.game-field');
		gameBoard.append(HtmlControlBuilder.createMovingGameObject(gameObjectField, bullet, 'bullet'));
	}
	public showContextMenu(gameObjectID: number, posX: number, posY: number): void {
		const gameObject = this.m_game.getBuyableGameObjectById(gameObjectID);
		if (gameObject) {
			const execGameObjectOption = (gameObject: GameObject, option: IGameObjectOption) => {
				try {
					this.m_game.buyGameObjectOption(option);
					option.execute();

					// Redraw
					const gameObjectField = GameFieldService.getGameObjectDivElement(gameObject.getID());
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

	public renderGameObject(gameObject: GameObject, parentField: HTMLDivElement): void {
		parentField.style.backgroundImage = `url('${AppConfig.svgPath}${gameObject.getSvg()}')`;

		if (!parentField.dataset.gameObjectId)
			parentField.dataset.gameObjectId = `${gameObject.getID()}`;
	}

	public renderPlayerStatusBar(statusInfo: IPlayerStatusInfo): void {
		this.m_htmlPlayerStatusBar.createPlayerStatusBar(this.m_parentContainer, statusInfo);
	}
}
