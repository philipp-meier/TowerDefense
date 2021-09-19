export class GameFieldService {
	public static isEventTargetInteractionField(target: EventTarget): boolean {
		return target && target instanceof HTMLDivElement && this.isInteractionField(target);
	}
	private static isInteractionField(container: HTMLDivElement): boolean {
		return container && container.classList.contains('interaction-field');
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
		const list: HTMLDivElement[] = [];

		document.querySelectorAll('div[data-game-object-id]:not(.interaction-field)').forEach(x => {
			list.push(<HTMLDivElement>x);
		});

		return list;
	}
}
