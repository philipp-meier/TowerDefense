import { GameBoard } from "../GameBoard.js";
import { AppConfig } from "./AppService.js";
import { IGameObjectOption, IPlayerStatusInfo, IRenderableObject, IRenderableText, IUIService } from "../Interfaces.js";
import { Tower } from "../gameObjects/Tower.js";
import { ContextMenu } from "../controls/ContextMenu.js";
import { Game } from "../Game.js";
import { MessageBox } from "../controls/MessageBox.js";
import { ControlBuilder } from "../controls/ControlBuilder.js";
import { PlayerStatusBar } from "../controls/PlayerStatusBar.js";
import { InteractionService } from "./InteractionService.js";
import { BuyableGameObject, GameObject, GameObjectBase } from "../gameObjects/GameObjectBase.js";
import { Bullet } from "../gameObjects/Bullet.js";
import { Enemy } from "../gameObjects/Enemy.js";
import { Rampart } from "../gameObjects/Rampart.js";

export class UIService implements IUIService {
	private readonly m_parentContainer: HTMLDivElement;
	private readonly m_game: Game;
	private m_htmlContextMenu: ContextMenu;
	private m_htmlMessageBox: MessageBox;
	private m_htmlPlayerStatusBar: PlayerStatusBar;

	constructor(container: HTMLDivElement, game: Game) {
		this.m_parentContainer = container;
		this.m_htmlContextMenu = new ContextMenu(container);
		this.m_htmlMessageBox = new MessageBox(container);
		this.m_htmlPlayerStatusBar = new PlayerStatusBar();
		this.m_game = game;
	}

	public registerInteractionHandlers(): void {
		InteractionService.registerHandlers(this.m_parentContainer, this);
	}

	public refreshUI(): void {
		if (this.m_game.isGameOver())
			return;

		this.removeDeletedGameObjects();

		this.m_game.getSpawnedBullets().forEach((bullet) => {
			const bulletDiv = InteractionService.getGameObjectDivElement(bullet.getID());

			this.m_game.getSpawnedGameObjects().forEach((gameObject) => {
				// Disable "friendly fire".
				if ((gameObject instanceof BuyableGameObject && bullet.isEnemyBullet()) ||
					gameObject instanceof Enemy && !bullet.isEnemyBullet()) {

					const gameObjectDiv = InteractionService.getGameObjectDivElement(gameObject.getID());
					if (bulletDiv && gameObjectDiv && this.isColliding(bulletDiv, gameObjectDiv))
						this.m_game.bulletHitsGameObject(bullet, gameObject);
				}

				// Move bullet
				if (bulletDiv) {
					const left = Number(bulletDiv.style.left.replace('px', ''));
					const width = Number(bulletDiv.style.width.replace('px', ''));
					const isBeyondBorder = bullet.isEnemyBullet() ?
						((left + width) <= 0) :
						((left + width) >= AppConfig.fieldWidth);

					if (isBeyondBorder) {
						this.removeGameObject(bullet);
					} else {
						const moveDirection = bullet.isEnemyBullet() ? -1 : 1;
						bulletDiv.style.left = (left + bullet.getAttackSpeed() * moveDirection) + 'px';
					}
				}
			});
		});

		this.m_game.getSpawnedEnemies().forEach((enemy) => {
			const enemyDiv = InteractionService.getGameObjectDivElement(enemy.getID());
			if (enemyDiv) {
				const left = Number(enemyDiv.style.left.replace('px', ''));
				if (left <= 0) {
					this.m_game.enemyHitsPlayer(enemy);
					if (this.m_game.isGameOver()) {
						// Restart by reloading the page.
						this.renderMessage('Game Over').then(() => { window.location.reload() });
					}

					this.removeGameObject(enemy);
				} else {
					enemyDiv.style.left = (left - enemy.getMoveSpeed()) + 'px';
				}

				// Collides with bought game object (tower,..)
				this.m_game.getSpawnedBuyableGameObjects().forEach((gameObject) => {
					const gameObjectDiv = InteractionService.getGameObjectDivElement(gameObject.getID());
					if (gameObjectDiv && enemyDiv && this.isColliding(enemyDiv, gameObjectDiv)) {
						this.m_game.enemyHitsBuyableGameObject(enemy, gameObject);
					}
				});
			}
		});

		this.m_game.getSpawnedGameObjects().forEach((gameObject) => {
			const gameObjectDiv = InteractionService.getGameObjectDivElement(gameObject.getID());
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

	private removeGameObject(gameObject: GameObjectBase): void {
		if (!gameObject)
			return;

		// Remove game object.
		this.m_game.removeGameObject(gameObject);

		// Remove ui object.
		const gameObjectDiv = InteractionService.getGameObjectDivElement(gameObject.getID());
		if (!gameObjectDiv)
			return;

		gameObjectDiv.parentNode?.removeChild(gameObjectDiv);

		// Remove ui object tracking.
		this.removeGameObjectUiTracking(gameObject.getID());
	}
	private removeGameObjectUiTracking(gameObjectID: number): void {
		const interactionField = document.querySelector(`div.interaction-field[data-game-object-id='${gameObjectID}']`);
		if (interactionField && interactionField instanceof HTMLDivElement)
			delete interactionField.dataset.gameObjectId;
	}

	public addGameObject(target: never): void {
		try {
			const gameObjectIdentifier = (<HTMLDivElement>document.querySelector('.selection-item.selected')).dataset.identifier;
			const gameObject = gameObjectIdentifier === "Tower" ? new Tower() : new Rampart();
			this.m_game.buyGameObject(gameObject);
			this.renderTower(gameObject, <HTMLDivElement>target);
		} catch (ex) {
			this.renderMessage((<Error>ex).message);
		}
	}

	private getAllRenderedGameObjects(): HTMLDivElement[] {
		const list: HTMLDivElement[] = [];

		document.querySelectorAll('div.game-object-layer div[data-game-object-id]').forEach(x => {
			list.push(<HTMLDivElement>x);
		});

		return list;
	}
	private removeDeletedGameObjects(): void {
		const gameObjectFields = this.getAllRenderedGameObjects();
		const existingBaseGameObjects = this.m_game.getBaseGameObjects();
		gameObjectFields.forEach(gameObjectField => {
			const gameObjectID = InteractionService.getGameObjectId(gameObjectField);
			if (gameObjectID && !existingBaseGameObjects.find(x => x.getID() === gameObjectID)) {
				gameObjectField.parentNode?.removeChild(gameObjectField);
				this.removeGameObjectUiTracking(gameObjectID);
			}
		});
	}
	public renderEnemy(enemy: Enemy): void {
		const spawnDiv = <HTMLDivElement>document.querySelector(`div.last[data-lane='${enemy.getLane()}']`);
		const gameObjectLayer = <HTMLDivElement>document.querySelector('.game-object-layer');
		gameObjectLayer.append(ControlBuilder.createGameObject(spawnDiv, enemy, 'enemy'));
	}
	public renderBullet(from: GameObject, bullet: Bullet): void {
		const gameObjectField = <HTMLDivElement>InteractionService.getGameObjectDivElement(from.getID());
		const gameObjectLayer = <HTMLDivElement>document.querySelector('.game-object-layer');
		const bulletDiv = ControlBuilder.createGameObject(gameObjectField, bullet, 'bullet');

		// TODO: Optimize (= enemy bullet spawn point)
		if (bullet.isEnemyBullet())
			bulletDiv.style.left = (Number(gameObjectField.style.left.replace('px', '')) - (AppConfig.fieldWidth / AppConfig.columnCount)) + "px";

		gameObjectLayer.append(bulletDiv);
	}
	public showContextMenu(gameObjectID: number, posX: number, posY: number): void {
		const gameObject = this.m_game.getBuyableGameObjectById(gameObjectID);
		if (gameObject) {
			const execGameObjectOption = (gameObject: GameObject, option: IGameObjectOption) => {
				try {
					this.m_game.buy(option);
					option.execute();

					// Redraw
					const gameObjectField = InteractionService.getGameObjectDivElement(gameObject.getID());
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
	public isContextMenuHidden = (): boolean => this.m_htmlContextMenu.isHidden();

	public renderMessageWithTitle(title: string, message: string): Promise<void> {
		if (!document.querySelector(".message-box"))
			return this.m_htmlMessageBox.show(title, message);
		return Promise.resolve();
	}
	public renderMessage(message: string): Promise<void> {
		return this.renderMessageWithTitle('Message', message);
	}
	public renderObject(obj: IRenderableObject): void {
		this.m_parentContainer.append(ControlBuilder.createObject(obj));
	}

	public renderAppTitle(title: string): void {
		this.renderText({ cssClass: "app-title", width: AppConfig.fieldWidth, height: 25, text: title });
	}
	public renderText(textObj: IRenderableText): void {
		this.m_parentContainer.append(ControlBuilder.createText(textObj));
	}

	public renderGameBoard(gameBoard: GameBoard): void {
		this.m_parentContainer.append(ControlBuilder.createGameBoard(gameBoard));
	}
	public renderGameObjectSelectionBar(): void {
		this.m_parentContainer.append(ControlBuilder.createGameObjectSelectionbar());
	}

	public renderTower(gameObject: GameObject, parentField: HTMLDivElement): void {
		const gameObjectLayer = <HTMLDivElement>document.querySelector('.game-object-layer');
		parentField.dataset.gameObjectId = gameObject.getID().toString();
		gameObjectLayer.append(ControlBuilder.createGameObject(parentField, gameObject, 'game-object'));
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