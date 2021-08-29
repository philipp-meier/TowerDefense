export class HtmlMessageBox {
	private m_htmlElement: HTMLDivElement;

	constructor(p: HTMLDivElement) {
		this.m_htmlElement = this.buildMessageBox();
		p.append(this.m_htmlElement);
	}

	private buildMessageBox(): HTMLDivElement {
		const menu = <HTMLDivElement>document.createElement('div');
		menu.className = "message-box hidden";

		const titleDiv = document.createElement('div');
		titleDiv.className = "title";
		menu.append(titleDiv);

		const textDiv = document.createElement('div');
		textDiv.className = "text";
		menu.append(textDiv);

		const commandDiv = document.createElement('div');
		commandDiv.className = "commands";

		const okButton = <HTMLButtonElement>document.createElement('button');
		okButton.type = "button";
		okButton.textContent = "OK";
		okButton.onclick = () => {
			this.hide();
		}

		commandDiv.append(okButton);
		menu.append(commandDiv);

		return menu;
	}

	public show(title: string, message: string) {
		const titleDiv = this.m_htmlElement.querySelector('div.title');
		if (titleDiv && titleDiv instanceof HTMLDivElement)
			titleDiv.textContent = title;

		const textDiv = this.m_htmlElement.querySelector('div.text');
		if (textDiv && textDiv instanceof HTMLDivElement)
			textDiv.textContent = message;

		this.m_htmlElement.classList.remove('hidden');
	}
	public hide() {
		this.m_htmlElement.classList.add('hidden');
	}
}
