import { IUIService } from "./Interfaces.js"

export class UIService implements IUIService {
	constructor() {
	}

	showMessage(message: string): void {
		alert(message);
	}
}
