/*
	=== User Interaction Service ===
	Handles user input and is therefore the only interface between the user and the game.
*/
import { ContextMenu } from "../controls/ContextMenu.js";
import { ControlBuilder } from "../controls/ControlBuilder.js";
import { Game } from "../Game.js";
import { GameObject } from "../gameObjects/GameObjectBase.js";
import { IGameObjectOption, IUIService } from "../Interfaces.js";

export class UserInteractionService {

	private m_game: Game;
	private m_uiService: IUIService;
	private m_isContextMenuHidden: boolean;

	constructor(uiService: IUIService, game: Game) {
		this.m_isContextMenuHidden = true;
		this.m_uiService = uiService;
		this.m_game = game;
	}

	public registerHandlers(parent: HTMLDivElement): void {
		const contextMenu = new ContextMenu(parent);

		parent.addEventListener('click', (e) => {
			const target = (e || window.event).target;

			if (!this.m_isContextMenuHidden) {
				if (!target || !(target instanceof HTMLAnchorElement || target instanceof HTMLSpanElement))
					contextMenu.hide();

				this.m_isContextMenuHidden = true;
				return;
			}

			if (!target || !this.isEventTargetInteractionField(target))
				return;

			const gameObjectID = this.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				this.addGameObject(<HTMLDivElement>target);
		});

		parent.addEventListener('contextmenu', (e) => {
			const event = e || window.event;
			event.preventDefault();

			const target = event.target;
			const gameObjectID = target && this.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				return;

			const gameObject = this.m_game.getPlayerGameObjectById(gameObjectID);
			if (gameObject) {
				contextMenu.show(gameObject, event.pageX, event.pageY, (_gameObject: GameObject, option: IGameObjectOption) => {
					try {
						this.m_game.buy(option);
						option.execute();
					} catch (ex) {
						this.m_uiService.renderMessage((<Error>ex).message);
					}
				});
			}
			this.m_isContextMenuHidden = false;
		}, false);
	}

	private addGameObject(target: HTMLDivElement): void {
		try {
			const gameObjectClassIdentifier = (<HTMLDivElement>document.querySelector('.selection-item.selected')).dataset.classIdentifier || "Tower";
			const targetLane = Number(target.dataset.lane || 0);
			const positionX = ControlBuilder.getNumberWithoutUnit(target.style.left);
			const gameObjectID = this.m_game.buyGameObject(gameObjectClassIdentifier, targetLane, positionX);
			target.dataset.gameObjectId = gameObjectID.toString();
		} catch (ex) {
			this.m_uiService.renderMessage((<Error>ex).message);
		}
	}

	public removeGameObjectInteraction(gameObjectID: number): void {
		const interactionField = document.querySelector(`div.interaction-field[data-game-object-id='${gameObjectID}']`);
		if (interactionField && interactionField instanceof HTMLDivElement)
			delete interactionField.dataset.gameObjectId;
	}

	private isEventTargetInteractionField(target: EventTarget): boolean {
		return target && target instanceof HTMLDivElement && this.isInteractionField(target);
	}
	private isInteractionField(container: HTMLDivElement): boolean {
		return container && container.classList.contains('interaction-field');
	}
	private getGameObjectIdFromEventTarget(target: EventTarget): number | null {
		if (target && target instanceof HTMLDivElement)
			return ControlBuilder.getGameObjectId(target);

		return null;
	}
}
