export class GameFieldService {
	public static isEventTargetGameField(target: EventTarget) {
		return target && target instanceof HTMLDivElement && this.isGameField(target);
	}
	private static isGameField(container: HTMLDivElement) {
		return container && container.classList.contains('game-field');
	}

	public static getGameObjectIdFromEventTarget(target: EventTarget): number | null {
		if (target && target instanceof HTMLDivElement)
			return this.getGameObjectId(target);

		return null;
	}
	private static getGameObjectId(container: HTMLDivElement): number | null {
		if (container && container.dataset.gameObjectId)
			return parseInt(container.dataset.gameObjectId);

		return null;
	}

	public static getGameObjectGameField(gameObjectID: number): HTMLDivElement | null {
		const container = document.querySelector(`div.game-field[data-game-object-id="${gameObjectID}"]`);
		if (container && container instanceof HTMLDivElement)
			return container;

		return null;
	}
}
