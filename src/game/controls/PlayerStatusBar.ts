/*
	=== Player Status Bar ===
	Displays player relevant information (i.E. health, coins, elapsed time, current enemy wave).
*/
import { GameSettings } from "../GameSettings.js";
import { IPlayerStatusInfo } from "../Interfaces.js";
import { ControlBuilder } from "./ControlBuilder.js";

export class PlayerStatusBar {

	public createPlayerStatusBar(parent: HTMLElement, statusInfo: IPlayerStatusInfo): void {
		const renderInfo = { height: 25, width: GameSettings.fieldWidth, cssClass: "player-status-bar" };
		const statusBar = ControlBuilder.createDiv(parent, renderInfo.cssClass);
		ControlBuilder.SetPosition(statusBar, renderInfo);

		this.createPlayerStatusBarItem(statusBar, "health.png", statusInfo.health.toFixed(), "health", "Health");
		this.createPlayerStatusBarItem(statusBar, "coin.png", statusInfo.coins.toFixed(), "coins", "Coins");
		this.createPlayerStatusBarItem(statusBar, "enemyWave.png", "1", "enemy-wave", "Current Wave");
		this.createPlayerStatusBarItem(statusBar, "timer.png", "00:00:00", "timer", "Elapsed time");
	}
	private createPlayerStatusBarItem(parent: HTMLElement, svgName: string, value: string, className: string, description: string | null = null): void {
		const statusBarItem = ControlBuilder.createDiv(null, className);
		statusBarItem.title = description || "";

		const imgDiv = ControlBuilder.createDiv(statusBarItem, "icon");
		imgDiv.style.backgroundImage = `url('${GameSettings.svgPath}statusBar/${svgName}')`;

		ControlBuilder.createSpan(statusBarItem, value.toString(), null);
		parent.append(statusBarItem);
	}

	public refreshPlayerStatusBar(statusInfo: IPlayerStatusInfo): void {
		const updateStatus = (identifier: string, value: string) => {
			const span = document.querySelector(`div.player-status-bar div.${identifier} span`);
			if (span && span instanceof HTMLSpanElement)
				span.textContent = value;
		};

		updateStatus("health", statusInfo.health.toFixed());
		updateStatus("coins", statusInfo.coins.toFixed());
		updateStatus("timer", this.getTimeElapsedString(statusInfo.startTime));
		updateStatus("enemy-wave", statusInfo.currentWave.toString());
	}
	private getTimeElapsedString(startTime: number): string {
		const timeElapsed = new Date(Date.now() - startTime);
		const formatTime = (time: number) => time.toString().padStart(2, '0');
		return `${formatTime(timeElapsed.getUTCHours())}:${formatTime(timeElapsed.getUTCMinutes())}:${formatTime(timeElapsed.getUTCSeconds())}`;
	}
}
