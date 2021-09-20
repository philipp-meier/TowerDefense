/*
	=== Interaction Service ===
	Interface between the user and the game.
*/
import { UIService } from "./UIService.js";

export class InteractionService {
	public static registerHandlers(parent: HTMLElement, uiService: UIService): void {
		parent.addEventListener('click', (e) => {
			e = e || window.event;
			const target = e.target;

			if (!uiService.isContextMenuHidden()) {
				if (!target || !(target instanceof HTMLAnchorElement || target instanceof HTMLSpanElement))
					uiService.hideContextMenu();

				return;
			}

			if (!target || !InteractionService.isEventTargetInteractionField(target))
				return;

			const gameObjectID = InteractionService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				uiService.addGameObject(<never>target);
		});

		parent.addEventListener('contextmenu', (e) => {
			e = e || window.event;
			e.preventDefault();

			const target = e.target;
			const gameObjectID = target && InteractionService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				return;

			uiService.showContextMenu(gameObjectID, e.pageX, e.pageY);
		}, false);
	}

	public static getGameObjectId(container: HTMLDivElement): number | null {
		if (container && container.dataset.gameObjectId)
			return parseInt(container.dataset.gameObjectId);

		return null;
	}
	public static getGameObjectDivElement(gameObjectID: number): HTMLDivElement | null {
		const container = document.querySelector(`div[data-game-object-id="${gameObjectID}"]`);
		if (container && container instanceof HTMLDivElement)
			return container;

		return null;
	}

	private static isEventTargetInteractionField(target: EventTarget): boolean {
		return target && target instanceof HTMLDivElement && this.isInteractionField(target);
	}
	private static isInteractionField(container: HTMLDivElement): boolean {
		return container && container.classList.contains('interaction-field');
	}
	private static getGameObjectIdFromEventTarget(target: EventTarget): number | null {
		if (target && target instanceof HTMLDivElement)
			return this.getGameObjectId(target);

		return null;
	}
}
