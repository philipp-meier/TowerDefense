/*
	=== UI Service ===
	Is responsible to draw the game objects/elements to the screen.
	This class must not contain game logic.
*/
import { GameBoard } from "../GameBoard.js";
import { IPlayerStatusInfo, IUIService } from "../Interfaces.js";
import { Game } from "../Game.js";
import { MessageBox } from "../controls/MessageBox.js";
import { ControlBuilder } from "../controls/ControlBuilder.js";
import { PlayerStatusBar } from "../controls/PlayerStatusBar.js";
import { UserInteractionService } from "./UserInteractionService.js";
import { GameObject, GameObjectBase } from "../gameObjects/GameObjectBase.js";
import { Bullet } from "../gameObjects/Bullet.js";
import { EnemyBase } from "../gameObjects/Enemies.js";
import { GameSettings } from "../GameSettings.js";
import { PlayerGameObjectBase } from "../gameObjects/PlayerObjects.js";

export class UIService implements IUIService {
	private readonly m_parentContainer: HTMLDivElement;
	private readonly m_game: Game;
	private m_htmlMessageBox: MessageBox;
	private m_htmlPlayerStatusBar: PlayerStatusBar;
	private m_interactionService: UserInteractionService;

	constructor(container: HTMLDivElement, game: Game) {
		this.m_parentContainer = container;
		this.m_htmlMessageBox = new MessageBox(container);
		this.m_htmlPlayerStatusBar = new PlayerStatusBar();
		this.m_interactionService = new UserInteractionService(this, game);
		this.m_game = game;
	}

	public init(): void {
		this.renderAppTitle(GameSettings.appTitle);
		this.renderPlayerStatusBar(this.m_game.getPlayerStatusInfo());
		this.renderGameObjectSelectionBar();
		this.renderGameBoard(this.m_game.getGameBoard());
	}

	public ensureScreenSizeSupported(showMessageOnFail = false): boolean {
		const isSupported = window.innerHeight > GameSettings.fieldHeight && window.innerWidth > GameSettings.fieldWidth;

		if (!isSupported && showMessageOnFail)
			this.renderMessage(`Resolution not supported! (Min.: ${GameSettings.fieldWidth}x${GameSettings.fieldHeight})`);

		return isSupported;
	}

	public registerInteractionHandlers = (): void => this.m_interactionService.registerHandlers(this.m_parentContainer);

	public refreshUI(): void {
		this.removeDeletedGameObjects();

		this.m_game.getSpawnedBaseGameObjects().forEach((gameObjectBase) => {
			const gameObjectDiv = this.getGameObjectDivElement(gameObjectBase.getID());

			if (!gameObjectDiv) {
				// Add spawned game object to the UI
				if (gameObjectBase instanceof EnemyBase)
					this.renderGameObject(gameObjectBase, "enemy");
				else if (gameObjectBase instanceof PlayerGameObjectBase)
					this.renderGameObject(gameObjectBase, "game-object");
				else if (gameObjectBase instanceof Bullet)
					this.renderGameObject(gameObjectBase, "bullet", gameObjectBase.isEnemyBullet() ? -(GameSettings.singleFieldWidth) : 0);
				else
					throw new Error("RefreshUI: GameObject not supported.");
			} else {
				// Refresh position
				gameObjectDiv.style.left = ControlBuilder.getUnitString(gameObjectBase.getPositionX());

				if (gameObjectBase instanceof GameObject) {
					// Refresh health bar
					const healthBarValueDiv = gameObjectDiv.querySelector('.health-bar > .value');
					if (healthBarValueDiv && healthBarValueDiv instanceof HTMLDivElement)
						healthBarValueDiv.style.width = gameObjectBase.getHealthInPercent() + '%';

					// Refresh svg
					if (gameObjectBase.hasSvgChanged()) {
						gameObjectDiv.style.backgroundImage = `url('${GameSettings.svgPath}${gameObjectBase.getSvg()}')`;
						gameObjectBase.acknowledgeSvgChange();
					}
				}
			}
		});

		this.m_htmlPlayerStatusBar.refreshPlayerStatusBar(this.m_game.getPlayerStatusInfo());
	}

	private removeDeletedGameObjects(): void {
		const gameObjectFields = document.querySelectorAll('div.game-object-layer div[data-game-object-id]');
		const existingBaseGameObjects = this.m_game.getSpawnedBaseGameObjects();
		gameObjectFields.forEach(gameObjectField => {
			if (gameObjectField instanceof HTMLDivElement) {
				const gameObjectID = ControlBuilder.getGameObjectId(gameObjectField);
				if (gameObjectID && !existingBaseGameObjects.find(x => x.getID() === gameObjectID)) {
					gameObjectField.parentNode?.removeChild(gameObjectField);
					this.m_interactionService.removeGameObjectInteraction(gameObjectID);
				}
			}
		});
	}

	public renderMessageWithTitle(title: string, message: string): Promise<void> {
		if (!document.querySelector(".message-box"))
			return this.m_htmlMessageBox.show(title, message);
		return Promise.resolve();
	}
	public renderMessage(message: string): Promise<void> {
		return this.renderMessageWithTitle('Message', message);
	}

	private renderGameObject(gameObject: GameObjectBase, className: string, offsetLeft = 0): void {
		const gameObjectLayer = <HTMLDivElement>document.querySelector('.game-object-layer');
		gameObjectLayer.append(ControlBuilder.createGameObject(gameObject, className, offsetLeft));
	}
	private renderAppTitle(title: string): void {
		this.m_parentContainer.append(ControlBuilder.createText({ cssClass: "app-title", width: GameSettings.fieldWidth, height: 25, text: title }));
	}
	private renderGameBoard(gameBoard: GameBoard): void {
		this.m_parentContainer.append(ControlBuilder.createGameBoard(gameBoard));
	}
	private renderGameObjectSelectionBar(): void {
		this.m_parentContainer.append(ControlBuilder.createGameObjectSelectionBar(this.m_game.getSelectableGameObjectTemplates()));
	}
	private renderPlayerStatusBar(statusInfo: IPlayerStatusInfo): void {
		this.m_htmlPlayerStatusBar.createPlayerStatusBar(this.m_parentContainer, statusInfo);
	}

	private getGameObjectDivElement(gameObjectID: number): HTMLDivElement | null {
		const container = document.querySelector(`div.game-object-layer div[data-game-object-id="${gameObjectID}"]`);
		if (container && container instanceof HTMLDivElement)
			return container;

		return null;
	}
}
