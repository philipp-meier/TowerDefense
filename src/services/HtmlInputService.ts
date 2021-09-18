import { GameFieldService } from "./GameFieldService.js";
import { UIService } from "./UIService.js";

export class HtmlInputService {
	public static registerHandlers(parent: HTMLElement, uiService: UIService): void {
		parent.addEventListener('click', (e) => {
			e = e || window.event;
			const target = e.target;

			if (!target || !GameFieldService.isEventTargetInteractionField(target))
				return;

			const gameObjectID = GameFieldService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				uiService.addGameObject(<never>target);
		});

		parent.addEventListener('contextmenu', (e) => {
			e = e || window.event;
			e.preventDefault();

			const target = e.target;
			const gameObjectID = target && GameFieldService.getGameObjectIdFromEventTarget(target);
			if (!gameObjectID)
				return;

			uiService.showContextMenu(gameObjectID, e.pageX, e.pageY);
		}, false);

		parent.addEventListener('mousedown', (e) => {
			e = e || window.event;
			const target = e.target;
			if (!target || !(target instanceof HTMLAnchorElement || target instanceof HTMLSpanElement))
				uiService.hideContextMenu();
		});
	}
	public static removeEventListeners(parent: HTMLElement): void {
		parent.replaceWith(parent.cloneNode(true));
	}
}
