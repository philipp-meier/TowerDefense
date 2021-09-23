import { GameBoard } from "../GameBoard.js";
import { IGameObjectOption, IPlayerStatusInfo, IRenderableObject, IRenderableText, IUIService } from "../Interfaces.js";
import { Tower, Rampart, PlayerGameObjectBase } from "../gameObjects/PlayerObjects.js";
import { ContextMenu } from "../controls/ContextMenu.js";
import { Game } from "../Game.js";
import { MessageBox } from "../controls/MessageBox.js";
import { ControlBuilder } from "../controls/ControlBuilder.js";
import { PlayerStatusBar } from "../controls/PlayerStatusBar.js";
import { InteractionService } from "./InteractionService.js";
import { GameObject, GameObjectBase } from "../gameObjects/GameObjectBase.js";
import { Bullet } from "../gameObjects/Bullet.js";
import { EnemyBase } from "../gameObjects/Enemies.js";
import { GameSettings } from "../GameSettings.js";

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
				if ((gameObject instanceof PlayerGameObjectBase && bullet.isEnemyBullet()) ||
					gameObject instanceof EnemyBase && !bullet.isEnemyBullet()) {

					const gameObjectDiv = InteractionService.getGameObjectDivElement(gameObject.getID());
					if (bulletDiv && gameObjectDiv && this.isColliding(bulletDiv, gameObjectDiv))
						this.m_game.bulletHitsGameObject(bullet, gameObject);
				}
			});

			// Move bullet
			if (bulletDiv) {
				const left = ControlBuilder.getNumberWithoutUnit(bulletDiv.style.left);
				const width = ControlBuilder.getNumberWithoutUnit(bulletDiv.style.width);
				const isBeyondBorder = bullet.isEnemyBullet() ?
					((left + width) <= 0) :
					((left + width) >= GameSettings.fieldWidth);

				if (isBeyondBorder) {
					if (bullet.isEnemyBullet())
						this.m_game.enemyHitsPlayer(bullet);

					this.removeGameObject(bullet);
				} else {
					const moveDirection = bullet.isEnemyBullet() ? -1 : 1;
					bulletDiv.style.left = ControlBuilder.getUnitString((left + bullet.getAttackSpeed() * moveDirection));
				}
			}
		});

		this.m_game.getSpawnedEnemies().forEach((enemy) => {
			const enemyDiv = InteractionService.getGameObjectDivElement(enemy.getID());
			if (enemyDiv) {
				const left = ControlBuilder.getNumberWithoutUnit(enemyDiv.style.left);
				if (left <= 0) {
					this.m_game.enemyHitsPlayer(enemy);
					this.removeGameObject(enemy);
				} else {
					enemyDiv.style.left = ControlBuilder.getUnitString(left - enemy.getMoveSpeed());
				}

				// Collides with player game object (tower,..)
				this.m_game.getSpawnedPlayerGameObjects().forEach((gameObject) => {
					const gameObjectDiv = InteractionService.getGameObjectDivElement(gameObject.getID());
					if (gameObjectDiv && enemyDiv && this.isColliding(enemyDiv, gameObjectDiv)) {
						this.m_game.enemyHitsPlayerGameObject(enemy, gameObject);
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
					healthBarValueDiv.style.width = gameObject.getHealthInPercent() + '%';
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

	public addGameObject(target: HTMLDivElement): void {
		try {
			const gameObjectIdentifier = (<HTMLDivElement>document.querySelector('.selection-item.selected')).dataset.identifier;
			const targetLane = Number(target.dataset.lane || 0);
			const gameObject = gameObjectIdentifier === "Tower" ? new Tower(targetLane) : new Rampart(targetLane);
			this.m_game.buyGameObject(gameObject);
			this.renderTower(gameObject, target);
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
	public renderEnemy(enemy: EnemyBase): void {
		const spawnDiv = <HTMLDivElement>document.querySelector(`div.last[data-lane='${enemy.getLane()}']`);
		const gameObjectLayer = <HTMLDivElement>document.querySelector('.game-object-layer');
		gameObjectLayer.append(ControlBuilder.createGameObject(spawnDiv, enemy, 'enemy'));
	}
	public renderBullet(from: GameObject, bullet: Bullet): void {
		const gameObjectField = <HTMLDivElement>InteractionService.getGameObjectDivElement(from.getID());
		const gameObjectLayer = <HTMLDivElement>document.querySelector('.game-object-layer');

		const offsetLeft = bullet.isEnemyBullet() ?
			-(GameSettings.fieldWidth / GameSettings.columnCount) : null;

		gameObjectLayer.append(ControlBuilder.createGameObject(gameObjectField, bullet, 'bullet', offsetLeft));
	}
	public showContextMenu(gameObjectID: number, posX: number, posY: number): void {
		const gameObject = this.m_game.getPlayerGameObjectById(gameObjectID);
		if (gameObject) {
			const execGameObjectOption = (gameObject: GameObject, option: IGameObjectOption) => {
				try {
					this.m_game.buy(option);
					option.execute();

					// Redraw
					const gameObjectField = InteractionService.getGameObjectDivElement(gameObject.getID());
					if (gameObjectField)
						gameObjectField.style.backgroundImage = `url('${GameSettings.svgPath}${gameObject.getSvg()}')`;
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
		this.renderText({ cssClass: "app-title", width: GameSettings.fieldWidth, height: 25, text: title });
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
		const width = GameSettings.fieldWidth / GameSettings.columnCount;
		const height = GameSettings.fieldHeight / GameSettings.rowCount;

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
