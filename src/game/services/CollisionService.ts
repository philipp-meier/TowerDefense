/*
	=== Collision Service ===
	Checks whether two game objects are colliding.
*/
import { GameObjectBase } from "../gameObjects/GameObjectBase.js";
import { GameSettings } from "../GameSettings.js";

export class CollisionService {
	public static isColliding(a: GameObjectBase, b: GameObjectBase): boolean {
		const rect1 = {
			x: a.getPositionX(),
			y: a.getLane() * GameSettings.singleFieldHeight,
			width: GameSettings.singleFieldWidth, height: GameSettings.singleFieldHeight
		};
		const rect2 = {
			x: b.getPositionX(),
			y: b.getLane() * GameSettings.singleFieldHeight,
			width: GameSettings.singleFieldWidth, height: GameSettings.singleFieldHeight
		};

		return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
	}
}
