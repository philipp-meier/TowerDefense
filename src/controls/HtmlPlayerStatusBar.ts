import { IPlayerStatusInfo } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";
import { HtmlControlBuilder } from "../services/HtmlControlBuilder.js";

export class HtmlPlayerStatusBar {

	public createPlayerStatusBar(parent: HTMLElement, statusInfo: IPlayerStatusInfo): void {
		const renderInfo = { height: 25, width: AppConfig.fieldWidth, cssClass: "player-status-bar" };
		const container = HtmlControlBuilder.createDiv(parent, renderInfo.cssClass);
		HtmlControlBuilder.SetPosition(container, renderInfo);

		const healthContainer = this.createPlayerStatusBarItem(`${AppConfig.svgPath}/StatusBar/health.svg`, statusInfo.health, "health");
		const coinContainer = this.createPlayerStatusBarItem(`${AppConfig.svgPath}/StatusBar/coin.svg`, statusInfo.coins, "coins");

		container.append(healthContainer);
		container.append(coinContainer);
	}
	private createPlayerStatusBarItem(svgPath: string, value: number, className: string): HTMLDivElement {
		const container = HtmlControlBuilder.createDiv(null, className);

		const imgDiv = HtmlControlBuilder.createDiv(container, "icon");
		imgDiv.style.backgroundImage = `url('${svgPath}')`;

		HtmlControlBuilder.createSpan(container, value.toString(), null);
		return container;
	}

	public refreshPlayerStatusBar(statusInfo: IPlayerStatusInfo): void {
		const renderInfo = { height: 25, width: AppConfig.fieldWidth, cssClass: "player-status-bar" };
		const healthSpan = document.querySelector(`div.${renderInfo.cssClass} div.health span`);
		if (healthSpan && healthSpan instanceof HTMLSpanElement)
			healthSpan.textContent = statusInfo.health.toString();

		const coinSpan = document.querySelector(`div.${renderInfo.cssClass} div.coins span`);
		if (coinSpan && coinSpan instanceof HTMLSpanElement)
			coinSpan.textContent = statusInfo.coins.toString();
	}
}
