/*
	=== Player Status Bar ===
	Displays player relevant information (i.E. health, coins, elapsed time).
*/
import { IPlayerStatusInfo } from "../Interfaces.js";
import { AppConfig } from "../services/AppService.js";
import { ControlBuilder } from "./ControlBuilder.js";

export class PlayerStatusBar {

	public createPlayerStatusBar(parent: HTMLElement, statusInfo: IPlayerStatusInfo): void {
		const renderInfo = { height: 25, width: AppConfig.fieldWidth, cssClass: "player-status-bar" };
		const container = ControlBuilder.createDiv(parent, renderInfo.cssClass);
		ControlBuilder.SetPosition(container, renderInfo);

		this.createPlayerStatusBarItem(container, `${AppConfig.svgPath}StatusBar/health.svg`, statusInfo.health.toString(), "health", "Health");
		this.createPlayerStatusBarItem(container, `${AppConfig.svgPath}StatusBar/coin.svg`, statusInfo.coins.toString(), "coins", "Coins");
		this.createPlayerStatusBarItem(container, `${AppConfig.svgPath}StatusBar/enemyWave.svg`, "1", "enemy-wave", "Current Wave");
		this.createPlayerStatusBarItem(container, `${AppConfig.svgPath}StatusBar/timer.svg`, "00:00:00", "timer", "Elapsed time");
	}
	private createPlayerStatusBarItem(parent: HTMLElement, svgPath: string, value: string, className: string, description: string | null = null): void {
		const container = ControlBuilder.createDiv(null, className);

		const imgDiv = ControlBuilder.createDiv(container, "icon");
		imgDiv.style.backgroundImage = `url('${svgPath}')`;

		if (description)
			container.title = description;

		ControlBuilder.createSpan(container, value.toString(), null);
		parent.append(container);
	}

	public refreshPlayerStatusBar(statusInfo: IPlayerStatusInfo): void {
		const renderInfo = { height: 25, width: AppConfig.fieldWidth, cssClass: "player-status-bar" };

		const updateStatus = (identifier: string, value: string) => {
			const span = document.querySelector(`div.${renderInfo.cssClass} div.${identifier} span`);
			if (span && span instanceof HTMLSpanElement)
				span.textContent = value;
		};

		updateStatus("health", statusInfo.health.toString());
		updateStatus("coins", statusInfo.coins.toString());
		updateStatus("timer", this.getTimeElapsedString(statusInfo.startTime));
		updateStatus("enemy-wave", statusInfo.currentWave.toString());
	}
	private getTimeElapsedString(startTime: number): string {
		const timeElapsed = new Date(Date.now() - startTime);
		const formatTime = (time: number) => time.toString().padStart(2, '0');
		return `${formatTime(timeElapsed.getUTCHours())}:${formatTime(timeElapsed.getUTCMinutes())}:${formatTime(timeElapsed.getUTCSeconds())}`;
	}
}
