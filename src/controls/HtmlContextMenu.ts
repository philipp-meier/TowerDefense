import { IGameObject, IGameObjectOption } from "../classes/Interfaces";

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
	private buildMenuItem(option: IGameObjectOption): HTMLLIElement {
		const menuItem = <HTMLLIElement>document.createElement('li');
		menuItem.className = "menu-item";

		const btn = document.createElement('a');
		btn.className = "menu-btn";
		btn.onclick = () => {
			option.execute();
			this.hide();
		};

		const span = document.createElement('span');
		span.className = "menu-text";
		span.textContent = option.title;

		btn.append(span);
		menuItem.append(btn);
		return menuItem;
	}

	private prepareContextMenu(gameObject: IGameObject) {
		this.m_htmlElement.innerText = '';
		gameObject.getOptions().forEach((option) => {
			this.m_htmlElement.append(this.buildMenuItem(option));
		});
	}
	public show(gameObject: IGameObject, x: number, y: number) {
		this.prepareContextMenu(gameObject);
		this.m_htmlElement.style.left = x + "px";
		this.m_htmlElement.style.top = y + "px";
		this.m_htmlElement.classList.add('menu-show');
	}
	public hide() {
		this.m_htmlElement.classList.remove('menu-show');
	}
}
