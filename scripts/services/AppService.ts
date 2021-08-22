import { IAppConfig as IAppConfig } from "../classes/Interfaces";

export const AppConfig: IAppConfig = {
	appTitle: "Tower Defense",
	fieldWidth: 800,
	fieldHeight: 600
};

export class AppService {
	constructor() { }

	static isSupportedScreenSize(): boolean {
		return window.innerHeight > AppConfig.fieldHeight && window.innerWidth > AppConfig.fieldWidth;
	}
}
