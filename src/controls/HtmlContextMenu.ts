import { BuyableGameObject, GameObject } from "../classes/GameObjects.js";
import { IGameObjectOption } from "../Interfaces.js";
import { HtmlControlBuilder } from "../services/HtmlControlBuilder.js";

type ContextMenuExecOptionCallback = (gameObject: GameObject, option: IGameObjectOption) => void;

export class HtmlContextMenu {
	private m_htmlElement: HTMLUListElement;
	private m_isHidden = true;

	constructor(p: HTMLDivElement) {
		this.m_htmlElement = this.buildMenu();
		p.append(this.m_htmlElement);
	}

	private buildMenu(): HTMLUListElement {
		return HtmlControlBuilder.createUListElement(null, "menu");
	}
	private buildMenuItem(gameObject: GameObject, option: IGameObjectOption, fnExecOptionCallback: ContextMenuExecOptionCallback): HTMLLIElement {
		const menuItem = HtmlControlBuilder.createListElement(null, "menu-item");

		const linkButton = <HTMLAnchorElement>HtmlControlBuilder.createHtmlElement('a', menuItem, "menu-btn");

		if (option.isAvailable) {
			linkButton.onclick = () => {
				fnExecOptionCallback(gameObject, option);
				this.hide();
			};
		} else {
			linkButton.classList.add('disabled');
		}

		HtmlControlBuilder.createSpan(linkButton, option.title, "menu-text");
		return menuItem;
	}

	private prepareContextMenu(gameObject: BuyableGameObject, fnExecOptionCallback: ContextMenuExecOptionCallback): boolean {
		const options = gameObject.getOptions();

		this.m_htmlElement.innerText = '';
		options.forEach((option) => {
			this.m_htmlElement.append(this.buildMenuItem(gameObject, option, fnExecOptionCallback));
		});

		return options.length > 0;
	}
	public show(gameObject: BuyableGameObject, x: number, y: number, fnExecOptionCallback: ContextMenuExecOptionCallback): void {
		if (this.prepareContextMenu(gameObject, fnExecOptionCallback)) {
			this.m_htmlElement.style.left = x + "px";
			this.m_htmlElement.style.top = y + "px";
			this.m_htmlElement.classList.add('menu-show');
			this.m_isHidden = false;
		}
	}
	public hide(): void {
		this.m_htmlElement.classList.remove('menu-show');
		this.m_isHidden = true;
	}

	public isHidden = (): boolean => this.m_isHidden;
}
