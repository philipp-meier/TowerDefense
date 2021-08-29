import { IRenderableObject } from "../Interfaces.js";

export class HtmlControlBuilder {
	private static m_cssUnit: string = 'px';

	private static createHtmlElement(tagName: string, parent: HTMLElement | null = null, cssClass: string | null = null) {
		const htmlElement = document.createElement(tagName);

		if (cssClass)
			htmlElement.className = cssClass;

		if (parent)
			parent.append(htmlElement);

		return htmlElement;
	}
	public static createDiv(parent: HTMLElement | null = null, cssClass: string | null = null): HTMLDivElement {
		return <HTMLDivElement>this.createHtmlElement('div', parent, cssClass);
	}

	public static createUListElement(parent: HTMLElement | null, cssClass: string | null = null): HTMLUListElement {
		return <HTMLUListElement>this.createHtmlElement('ul', parent, cssClass);
	}
	public static createListElement(parent: HTMLElement | null, cssClass: string | null): HTMLLIElement {
		return <HTMLLIElement>this.createHtmlElement('li', parent, cssClass);
	}

	public static createSpan(parent: HTMLElement, text: string, cssClass: string | null = null): HTMLSpanElement {
		const span = <HTMLSpanElement>this.createHtmlElement('span', parent, cssClass);
		span.textContent = text;

		return span;
	}
	public static createLinkButton(parent: HTMLElement, cssClass: string | null, onClick: VoidFunction): HTMLAnchorElement {
		const linkButton = <HTMLAnchorElement>this.createHtmlElement('a', parent, cssClass);
		linkButton.onclick = onClick;
		return linkButton;
	}
	public static createButton(parent: HTMLElement, text: string, onClick: VoidFunction): HTMLButtonElement {
		const btn = <HTMLButtonElement>this.createHtmlElement('button', parent);
		btn.type = "button";
		btn.textContent = text;
		btn.onclick = onClick;
		return btn;
	}

	public static createObject(obj: IRenderableObject): HTMLElement {
		const container = <HTMLDivElement>this.createDiv(null, obj.cssClass);
		HtmlControlBuilder.SetPosition(container, obj);
		return container;
	}
	public static SetPosition(element: HTMLElement, ro: IRenderableObject): void {
		element.style.width = HtmlControlBuilder.getUnitString(ro.width);
		element.style.height = HtmlControlBuilder.getUnitString(ro.height);
	}
	public static getUnitString(n: number): string {
		return `${n}${HtmlControlBuilder.m_cssUnit}`;
	}
}
