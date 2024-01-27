/*
	=== Game Context Menu ===
	Displays (purchasable) options for player game objects (i.E. upgrade, repair,...).
*/
import { PlayerGameObjectBase } from "../gameObjects/PlayerObjects.js";
import { IGameObjectOption } from "../Interfaces.js";
import { ControlBuilder } from "./ControlBuilder.js";

type ContextMenuExecOptionCallback = (gameObject: PlayerGameObjectBase, option: IGameObjectOption) => void;

export class ContextMenu {
	private readonly m_ContextMenu: HTMLUListElement;

	constructor(p: HTMLDivElement) {
		this.m_ContextMenu = this.buildContextMenu();
		p.append(this.m_ContextMenu);
	}

	public show(gameObject: PlayerGameObjectBase, x: number, y: number, fnExecOptionCallback: ContextMenuExecOptionCallback): void {
		if (this.prepareContextMenu(gameObject, fnExecOptionCallback)) {
			this.m_ContextMenu.style.left = ControlBuilder.getUnitString(x);
			this.m_ContextMenu.style.top = ControlBuilder.getUnitString(y);
			this.m_ContextMenu.classList.add('menu-show');
		}
	}
	public hide(): void {
		this.m_ContextMenu.classList.remove('menu-show');
	}

	private buildContextMenu(): HTMLUListElement {
		return <HTMLUListElement>ControlBuilder.createHtmlElement('ul', null, "menu")
	}
	private buildMenuItem(gameObject: PlayerGameObjectBase, option: IGameObjectOption, fnExecOptionCallback: ContextMenuExecOptionCallback): HTMLLIElement {
		const menuItem = <HTMLLIElement>ControlBuilder.createHtmlElement('li', null, "menu-item");
		const linkButton = <HTMLAnchorElement>ControlBuilder.createHtmlElement('a', menuItem, "menu-btn");

		if (option.isAvailable) {
			linkButton.onclick = () => {
				fnExecOptionCallback(gameObject, option);
				this.hide();
			};
		} else {
			linkButton.classList.add('disabled');
		}

		ControlBuilder.createDiv(linkButton, "icon");
		ControlBuilder.createSpan(linkButton, option.title, "menu-text");
		return menuItem;
	}
	private prepareContextMenu(gameObject: PlayerGameObjectBase, fnExecOptionCallback: ContextMenuExecOptionCallback): boolean {
		const options = gameObject.getOptions();

		this.m_ContextMenu.innerText = '';
		options.forEach((option) => {
			this.m_ContextMenu.append(this.buildMenuItem(gameObject, option, fnExecOptionCallback));
		});

		return options.length > 0;
	}
}
