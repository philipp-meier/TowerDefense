/*
	=== Message Box ===
	Displays a centered message box with an "OK" button.
*/
import { ControlBuilder } from "./ControlBuilder.js";

export class MessageBox {
	private readonly m_container: HTMLDivElement;

	constructor(p: HTMLDivElement) {
		this.m_container = p;
	}

	public show(title: string, message: string): Promise<void> {
		return new Promise((resolve) => {
			const messageBox = ControlBuilder.createDiv(this.m_container, "message-box");
			const titleDiv = ControlBuilder.createDiv(messageBox, "title");
			titleDiv.textContent = title;

			const textDiv = ControlBuilder.createDiv(messageBox, "text");
			textDiv.innerHTML = message;

			const commandDiv = ControlBuilder.createDiv(messageBox, "commands");
			ControlBuilder.createButton(commandDiv, "OK", () => {
				this.m_container.removeChild(messageBox);
				resolve();
			});
		})
	}
}
