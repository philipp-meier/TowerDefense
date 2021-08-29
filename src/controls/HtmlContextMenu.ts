import { IGameObject, IGameObjectOption } from "../Interfaces";

type ContextMenuCallback = (gameObject: IGameObject) => void;

export class HtmlContextMenu {
	private m_htmlElement: HTMLUListElement;

	constructor(p: HTMLDivElement) {
		this.m_htmlElement = this.buildMenu();
		p.append(this.m_htmlElement);
	}

	private buildMenu(): HTMLUListElement {
		const menu = <HTMLUListElement>document.createElement('ul');
		menu.className = "menu";
		return menu;
	}
	private buildMenuItem(gameObject: IGameObject, option: IGameObjectOption, fnCallback: ContextMenuCallback): HTMLLIElement {
		const menuItem = <HTMLLIElement>document.createElement('li');
		menuItem.className = "menu-item";

		const btn = document.createElement('a');
		btn.className = "menu-btn";
		btn.onclick = () => {
			option.execute();
			fnCallback(gameObject);
			this.hide();
		};

		const span = document.createElement('span');
		span.className = "menu-text";
		span.textContent = option.title;

		btn.append(span);
		menuItem.append(btn);
		return menuItem;
	}

	private prepareContextMenu(gameObject: IGameObject, fnCallback: ContextMenuCallback): boolean {
		const options = gameObject.getOptions();

		this.m_htmlElement.innerText = '';
		options.forEach((option) => {
			this.m_htmlElement.append(this.buildMenuItem(gameObject, option, fnCallback));
		});

		return options.length > 0;
	}
	public show(gameObject: IGameObject, x: number, y: number, fnCallback: ContextMenuCallback) {
		if (this.prepareContextMenu(gameObject, fnCallback)) {
			this.m_htmlElement.style.left = x + "px";
			this.m_htmlElement.style.top = y + "px";
			this.m_htmlElement.classList.add('menu-show');
		}
	}
	public hide() {
		this.m_htmlElement.classList.remove('menu-show');
	}
}
