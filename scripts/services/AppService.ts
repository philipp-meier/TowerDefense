import { IAppConfig as IAppConfig } from "../classes/Interfaces.js";

export const AppConfig: IAppConfig = {
	appTitle: "Tower Defense",
	fieldWidth: 800,
	fieldHeight: 600,
	rowCount: 6,
	columnCount: 8
};

export class AppService {
	constructor() { }

	static isSupportedScreenSize(): boolean {
		return window.innerHeight > AppConfig.fieldHeight && window.innerWidth > AppConfig.fieldWidth;
	}
}
