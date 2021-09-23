import { GameSettings } from "../GameSettings.js";

export class AppService {
	public static isSupportedScreenSize(): boolean {
		return window.innerHeight > GameSettings.fieldHeight && window.innerWidth > GameSettings.fieldWidth;
	}
}
