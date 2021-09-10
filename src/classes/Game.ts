import { IGameObjectOption, IPlayerStatusInfo, IUIService } from "../Interfaces.js";
import { BuyableGameObject, GameObjectBase } from "./GameObjects.js";
import { AppConfig } from "../services/AppService.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";
import { Tower } from "./Tower.js";
import { Bullet } from "./Bullet.js";
import { Enemy } from "./Enemy.js";

export class Game {
	private m_player: Player;
	private m_gameBoard: GameBoard;
	private m_gameObjects: GameObjectBase[] = [];

	constructor() {
		this.m_player = new Player();
		this.m_gameBoard = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	}

	public start(uiService: IUIService): void {
		uiService.renderAppTitle(AppConfig.appTitle);
		uiService.renderPlayerStatusBar(this.getPlayerStatusInfo());
		uiService.renderGameBoard(this.m_gameBoard);

		this.bulletLoop(uiService);
		this.enemyLoop(uiService);
		this.updateLoop(uiService);
	}
	private updateLoop(uiService: IUIService): void {
		if (this.isGameOver())
			return;

		uiService.refreshUI();
		window.requestAnimationFrame(() => { this.updateLoop(uiService); });
	}
	private enemyLoop(uiService: IUIService): void {
		const spawnEnemies = () => {
			if (this.isGameOver())
				return;

			const enemy = new Enemy(this.getRandomNumber(0, AppConfig.rowCount));
			this.spawnGameObject(enemy);
			uiService.renderEnemy(enemy);
			setTimeout(spawnEnemies, 10000);
		};
		setTimeout(spawnEnemies, 10000);
	}
	private bulletLoop(uiService: IUIService): void {
		const spawnBullets = () => {
			if (this.isGameOver())
				return;

			this.m_gameObjects.filter(x => x instanceof Tower).forEach((x) => {
				const tower = <Tower>x;
				const bullet = tower.spawnBullet();
				this.spawnGameObject(bullet);
				uiService.renderBullet(tower, bullet);
			});
			setTimeout(spawnBullets, 5000);
		};
		setTimeout(spawnBullets, 5000);
	}

	private getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min) + min);
	}

	public buyGameObject(gameObject: BuyableGameObject): void {
		// TODO: Object should not be created at all, if it is too expensive.
		this.m_player.buyItem(gameObject);
		this.m_gameObjects.push(gameObject);
	}
	public buyGameObjectOption(option: IGameObjectOption): void {
		this.m_player.buyItem(option);
	}
	public spawnGameObject(gameObject: GameObjectBase): void {
		this.m_gameObjects.push(gameObject);
	}
	public removeGameObject(gameObject: GameObjectBase): void {
		const item = this.m_gameObjects.find(x => x.getID() == gameObject.getID());
		if (item) {
			const index = this.m_gameObjects.indexOf(item);
			this.m_gameObjects.splice(index, 1);
		}
	}

	public bulletHitsEnemy(bullet: Bullet, enemy: Enemy): void {
		if (enemy && bullet) {
			if (enemy.getHealth() - bullet.getDamage() <= 0) {
				this.m_player.awardCoins(enemy.getCoins());
				this.removeGameObject(enemy);
			} else {
				enemy.takeDamage(bullet.getDamage());
			}
			this.removeGameObject(bullet);
		}
	}

	public enemyHitsPlayer(enemy: Enemy): void {
		this.m_player.takeDamage(enemy.getDamage());
	}

	public isGameOver(): boolean {
		return this.m_player.getHealth() <= 0;
	}

	public getBuyableGameObjectById(id: number): BuyableGameObject | undefined {
		return <BuyableGameObject | undefined>this.m_gameObjects.find(x => x instanceof BuyableGameObject && x.getID() == id);
	}
	public getPlayerStatusInfo(): IPlayerStatusInfo {
		return {
			health: this.m_player.getHealth(),
			coins: this.m_player.getCoins()
		};
	}
	public getGameObjects(): GameObjectBase[] {
		return this.m_gameObjects;
	}
	public getSpawnedBullets(): Bullet[] {
		return <Bullet[]>this.m_gameObjects.filter(x => x instanceof Bullet);
	}
	public getSpawnedEnemies(): Enemy[] {
		return <Enemy[]>this.m_gameObjects.filter(x => x instanceof Enemy);
	}
}
