import { IGameObject, IGameObjectOption } from "../classes/Interfaces";

export class HtmlContextMenu {
	private htmlElement: HTMLUListElement;

	constructor(p: HTMLDivElement) {
		this.htmlElement = this.buildMenu();
		p.append(this.htmlElement);
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
		this.htmlElement.innerText = '';
		gameObject.getOptions().forEach((option) => {
			this.htmlElement.append(this.buildMenuItem(option));
		});
	}
	public show(gameObject: IGameObject, x: number, y: number) {
		this.prepareContextMenu(gameObject);
		this.htmlElement.style.left = x + "px";
		this.htmlElement.style.top = y + "px";
		this.htmlElement.classList.add('menu-show');
	}
	public hide() {
		this.htmlElement.classList.remove('menu-show');
	}
}
