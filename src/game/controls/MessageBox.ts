import { HtmlControlBuilder } from "./ControlBuilder.js";

export class HtmlMessageBox {
	private m_container: HTMLDivElement;

	constructor(p: HTMLDivElement) {
		this.m_container = p;
	}

	public show(title: string, message: string): Promise<void> {
		return new Promise((resolve) => {
			const messageBox = HtmlControlBuilder.createDiv(this.m_container, "message-box");
			const titleDiv = HtmlControlBuilder.createDiv(messageBox, "title");
			titleDiv.textContent = title;

			const textDiv = HtmlControlBuilder.createDiv(messageBox, "text");
			textDiv.innerHTML = message;

			const commandDiv = HtmlControlBuilder.createDiv(messageBox, "commands");
			HtmlControlBuilder.createButton(commandDiv, "OK", () => {
				this.m_container.removeChild(messageBox);
				resolve();
			});
		})
	}
}
