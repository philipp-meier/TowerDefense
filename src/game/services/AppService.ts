import { IAppConfig as IAppConfig } from "../Interfaces.js";

export const AppConfig: IAppConfig = {
	appTitle: "Tower Defense",
	fieldWidth: 1200,
	fieldHeight: 600,
	rowCount: 6,
	columnCount: 12,
	svgPath: "img/",
	enemyWaveGoal: 5
};

export class AppService {
	public static isSupportedScreenSize(): boolean {
		return window.innerHeight > AppConfig.fieldHeight && window.innerWidth > AppConfig.fieldWidth;
	}
}
