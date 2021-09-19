/*
	=== Game Context Menu ===
	Displays (buyable) options for game objects (i.E. upgrade, repair,...).
*/
import { BuyableGameObject, GameObject } from "../gameObjects/GameObjectBase.js";
import { IGameObjectOption } from "../Interfaces.js";
import { ControlBuilder } from "./ControlBuilder.js";

type ContextMenuExecOptionCallback = (gameObject: GameObject, option: IGameObjectOption) => void;

export class ContextMenu {
	private m_ContextMenu: HTMLUListElement;
	private m_isHidden = true;

	constructor(p: HTMLDivElement) {
		this.m_ContextMenu = this.buildContextMenu();
		p.append(this.m_ContextMenu);
	}

	private buildContextMenu(): HTMLUListElement {
		return ControlBuilder.createUListElement(null, "menu");
	}
	private buildMenuItem(gameObject: GameObject, option: IGameObjectOption, fnExecOptionCallback: ContextMenuExecOptionCallback): HTMLLIElement {
		const menuItem = ControlBuilder.createListElement(null, "menu-item");
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

	private prepareContextMenu(gameObject: BuyableGameObject, fnExecOptionCallback: ContextMenuExecOptionCallback): boolean {
		const options = gameObject.getOptions();

		this.m_ContextMenu.innerText = '';
		options.forEach((option) => {
			this.m_ContextMenu.append(this.buildMenuItem(gameObject, option, fnExecOptionCallback));
		});

		return options.length > 0;
	}
	public show(gameObject: BuyableGameObject, x: number, y: number, fnExecOptionCallback: ContextMenuExecOptionCallback): void {
		if (this.prepareContextMenu(gameObject, fnExecOptionCallback)) {
			this.m_ContextMenu.style.left = x + "px";
			this.m_ContextMenu.style.top = y + "px";
			this.m_ContextMenu.classList.add('menu-show');
			this.m_isHidden = false;
		}
	}
	public hide(): void {
		this.m_ContextMenu.classList.remove('menu-show');
		this.m_isHidden = true;
	}

	public isHidden = (): boolean => this.m_isHidden;
}
