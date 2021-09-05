export class GameFieldService {
	public static isEventTargetGameField(target: EventTarget): boolean {
		return target && target instanceof HTMLDivElement && this.isGameField(target);
	}
	private static isGameField(container: HTMLDivElement): boolean {
		return container && container.classList.contains('game-field');
	}

	public static getGameObjectIdFromEventTarget(target: EventTarget): number | null {
		if (target && target instanceof HTMLDivElement)
			return this.getGameObjectId(target);

		return null;
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

	public static getAllRenderedGameObjects(): HTMLDivElement[] {
		const list : HTMLDivElement[] = [];

		document.querySelectorAll('div[data-game-object-id]').forEach(x => {
			if (x instanceof HTMLDivElement)
				list.push(x);
		});

		return list;
	}
}
