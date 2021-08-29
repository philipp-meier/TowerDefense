import { HtmlControlBuilder } from "../services/HtmlControlBuilder.js";

export class HtmlMessageBox {
	private m_htmlElement: HTMLDivElement;

	constructor(p: HTMLDivElement) {
		this.m_htmlElement = this.buildMessageBox();
		p.append(this.m_htmlElement);
	}

	private buildMessageBox(): HTMLDivElement {
		const menu = HtmlControlBuilder.createDiv(null, "message-box hidden");
		HtmlControlBuilder.createDiv(menu, "title");
		HtmlControlBuilder.createDiv(menu, "text");

		const commandDiv = HtmlControlBuilder.createDiv(menu, "commands");
		HtmlControlBuilder.createButton(commandDiv, "OK", () => { this.hide(); });

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
