import { IGameObject, IGameObjectOption } from "../Interfaces.js";
import { HtmlControlBuilder } from "../services/HtmlControlBuilder.js";

type ContextMenuExecOptionCallback = (gameObject: IGameObject, option: IGameObjectOption) => void;

export class HtmlContextMenu {
	private m_htmlElement: HTMLUListElement;

	constructor(p: HTMLDivElement) {
		this.m_htmlElement = this.buildMenu();
		p.append(this.m_htmlElement);
	}

	private buildMenu(): HTMLUListElement {
		return HtmlControlBuilder.createUListElement(null, "menu");
	}
	private buildMenuItem(gameObject: IGameObject, option: IGameObjectOption, fnExecOptionCallback: ContextMenuExecOptionCallback): HTMLLIElement {
		const menuItem = HtmlControlBuilder.createListElement(null, "menu-item");

		const btn = HtmlControlBuilder.createLinkButton(menuItem, "menu-btn", () => {
			fnExecOptionCallback(gameObject, option);
			this.hide();
		});

		HtmlControlBuilder.createSpan(btn, option.title, "menu-text");
		return menuItem;
	}

	private prepareContextMenu(gameObject: IGameObject, fnExecOptionCallback: ContextMenuExecOptionCallback): boolean {
		const options = gameObject.getOptions();

		this.m_htmlElement.innerText = '';
		options.forEach((option) => {
			this.m_htmlElement.append(this.buildMenuItem(gameObject, option, fnExecOptionCallback));
		});

		return options.length > 0;
	}
	public show(gameObject: IGameObject, x: number, y: number, fnExecOptionCallback: ContextMenuExecOptionCallback) {
		if (this.prepareContextMenu(gameObject, fnExecOptionCallback)) {
			this.m_htmlElement.style.left = x + "px";
			this.m_htmlElement.style.top = y + "px";
			this.m_htmlElement.classList.add('menu-show');
		}
	}
	public hide() {
		this.m_htmlElement.classList.remove('menu-show');
	}
}
