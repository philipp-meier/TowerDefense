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
		if (this.m_game.isGameOver())
			return;

		this.removeDeletedGameObjects();

		this.m_game.getSpawnedBullets().forEach((bullet) => {
			const bulletDiv = GameFieldService.getGameObjectDivElement(bullet.getID());

			this.m_game.getSpawnedEnemies().forEach((enemy) => {
				const enemyDiv = GameFieldService.getGameObjectDivElement(enemy.getID());
				if (bulletDiv && enemyDiv && this.isColliding(bulletDiv, enemyDiv)) {
					this.m_game.bulletHitsEnemy(bullet, enemy);
				}
			});

			if (bulletDiv) {
				const left = Number(bulletDiv.style.left.replace('px', ''));
				const width = Number(bulletDiv.style.width.replace('px', ''));
				if ((left + width) >= AppConfig.fieldWidth) {
					this.m_game.removeGameObject(bullet);
					this.removeFromParentElement(bulletDiv);
				} else {
					bulletDiv.style.left = (left + bullet.getSpeed()) + 'px';
				}
			}
		});

		this.m_game.getSpawnedEnemies().forEach((enemy) => {
			const enemyDiv = GameFieldService.getGameObjectDivElement(enemy.getID());
			if (enemyDiv) {
				const left = Number(enemyDiv.style.left.replace('px', ''));
				if (left <= 0) {
					this.m_game.enemyHitsPlayer(enemy);
					if (this.m_game.isGameOver()) {
						this.renderMessage('Game Over');
						HtmlInputService.removeEventListeners(this.m_parentContainer);
					}

					this.m_game.removeGameObject(enemy);
					this.removeFromParentElement(enemyDiv);
				} else {
					// TODO: Speed
					enemyDiv.style.left = (left - 1) + 'px';
				}

				// Collides with tower
				this.m_game.getSpawnedTowers().forEach((tower) => {
					const towerDiv = GameFieldService.getGameObjectDivElement(tower.getID());
					if (towerDiv && enemyDiv && this.isColliding(enemyDiv, towerDiv)) {
						this.m_game.enemyHitsTower(enemy, tower);
					}
				});
			}
		});

		this.m_game.getGameObjects().forEach((gameObject) => {
			if (!(gameObject instanceof GameObject))
				return;

			const gameObjectDiv = GameFieldService.getGameObjectDivElement(gameObject.getID());
			if (gameObjectDiv) {
				// Refresh health bar
				const healthBarValueDiv = gameObjectDiv.querySelector('.health-bar > .value');
				if (healthBarValueDiv && healthBarValueDiv instanceof HTMLDivElement) {
					healthBarValueDiv.style.width = gameObject.getHealth() + '%';
				}
			}
		});

		this.m_htmlPlayerStatusBar.refreshPlayerStatusBar(this.m_game.getPlayerStatusInfo());
	}

	private removeFromParentElement(htmlElement: HTMLElement): void {
		htmlElement.parentNode?.removeChild(htmlElement);
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
	private removeDeletedGameObjects(): void {
		const gameObjectFields = GameFieldService.getAllRenderedGameObjects();
		const existingGameObjects = this.m_game.getGameObjects();
		gameObjectFields.forEach(gameObjectField => {
			const gameObjectID = GameFieldService.getGameObjectId(gameObjectField);
			if (gameObjectID && !existingGameObjects.find(x => x.getID() === gameObjectID)) {
				this.removeFromParentElement(gameObjectField);
			}
		});
	}
	public renderEnemy(enemy: Enemy): void {
		const spawnDiv = <HTMLDivElement>document.querySelector(`div.last[data-lane='${enemy.getLane()}']`);
		const gameBoard = <HTMLDivElement>document.querySelector('.game-board');
		gameBoard.append(HtmlControlBuilder.createGameObject(spawnDiv, enemy, 'enemy'));
	}
	public renderBullet(from: GameObject, bullet: Bullet): void {
		const gameObjectField = <HTMLDivElement>GameFieldService.getGameObjectDivElement(from.getID());
		const gameBoard = <HTMLDivElement>document.querySelector('.game-board');
		gameBoard.append(HtmlControlBuilder.createGameObject(gameObjectField, bullet, 'bullet'));
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
		const gameBoard = <HTMLDivElement>document.querySelector('.game-board');
		gameBoard.append(HtmlControlBuilder.createGameObject(parentField, gameObject, 'game-object'));
	}

	public renderPlayerStatusBar(statusInfo: IPlayerStatusInfo): void {
		this.m_htmlPlayerStatusBar.createPlayerStatusBar(this.m_parentContainer, statusInfo);
	}

	private isColliding(a: HTMLDivElement, b: HTMLDivElement): boolean {
		const width = AppConfig.fieldWidth / AppConfig.columnCount;
		const height = AppConfig.fieldHeight / AppConfig.rowCount;

		const rect1 = {
			x: parseInt(a.style.left, 10),
			y: parseInt(a.style.top, 10),
			width: width, height: height
		};
		const rect2 = {
			x: parseInt(b.style.left, 10),
			y: parseInt(b.style.top, 10),
			width: width, height: height
		};

		return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
	}
}
