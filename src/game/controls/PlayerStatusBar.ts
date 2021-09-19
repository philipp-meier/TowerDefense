/*
	=== Player Status Bar ===
	Displays player relevant information (i.E. health, coins).
*/
import { IPlayerStatusInfo } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";
import { ControlBuilder } from "./ControlBuilder.js";

export class PlayerStatusBar {

	public createPlayerStatusBar(parent: HTMLElement, statusInfo: IPlayerStatusInfo): void {
		const renderInfo = { height: 25, width: AppConfig.fieldWidth, cssClass: "player-status-bar" };
		const container = ControlBuilder.createDiv(parent, renderInfo.cssClass);
		ControlBuilder.SetPosition(container, renderInfo);

		const healthContainer = this.createPlayerStatusBarItem(`${AppConfig.svgPath}StatusBar/health.svg`, statusInfo.health, "health", "Health");
		const coinContainer = this.createPlayerStatusBarItem(`${AppConfig.svgPath}StatusBar/coin.svg`, statusInfo.coins, "coins", "Coins");

		container.append(healthContainer);
		container.append(coinContainer);
	}
	private createPlayerStatusBarItem(svgPath: string, value: number, className: string, description: string | null = null): HTMLDivElement {
		const container = ControlBuilder.createDiv(null, className);

		const imgDiv = ControlBuilder.createDiv(container, "icon");
		imgDiv.style.backgroundImage = `url('${svgPath}')`;

		if (description)
			container.title = description;

		ControlBuilder.createSpan(container, value.toString(), null);
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
