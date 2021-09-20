import { IAttackingGameObject, IPlayerStatusInfo, IPricedObject, IShootingGameObject, IUIService } from "./Interfaces.js";
import { BuyableGameObject, GameObject, GameObjectBase } from "./gameObjects/GameObjectBase.js";
import { AppConfig } from "./services/AppService.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";
import { Tower } from "./gameObjects/Tower.js";
import { Bullet } from "./gameObjects/Bullet.js";
import { Enemy } from "./gameObjects/Enemy.js";
import { ShootingEnemy } from "./gameObjects/ShootingEnemy.js";

export class Game {
	private m_player: Player;
	private m_gameBoard: GameBoard;
	private m_gameObjects: GameObjectBase[] = [];

	private readonly m_bulletSpawnTimeInMs = 5000;
	private readonly m_enemySpawnTimeInMs = 10_000;

	constructor() {
		this.m_player = new Player();
		this.m_gameBoard = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	}

	public start(uiService: IUIService): void {
		uiService.renderAppTitle(AppConfig.appTitle);
		uiService.renderPlayerStatusBar(this.getPlayerStatusInfo());
		uiService.renderGameObjectSelectionBar();
		uiService.renderGameBoard(this.m_gameBoard);

		// Show game controls
		uiService.renderMessageWithTitle("Controls", "Left click = Buy selected game object<br>Right click = Upgrade existing game object")
			.then(() => {
				uiService.registerInteractionHandlers();

				// Start game
				this.bulletLoop(uiService);
				this.enemyLoop(uiService);
				this.updateLoop(uiService);
			});
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

			const enemy = (this.getRandomNumber(0, 50) >= 25) ?
				new ShootingEnemy(this.getRandomNumber(0, AppConfig.rowCount)) :
				new Enemy(this.getRandomNumber(0, AppConfig.rowCount));

			this.spawnGameObject(enemy);
			uiService.renderEnemy(enemy);
			setTimeout(spawnEnemies, this.m_enemySpawnTimeInMs);
		};
		setTimeout(spawnEnemies, this.m_enemySpawnTimeInMs);
	}
	private bulletLoop(uiService: IUIService): void {
		const spawnBullets = () => {
			if (this.isGameOver())
				return;

			this.m_gameObjects.filter(x => x instanceof Tower || x instanceof ShootingEnemy).forEach((x) => {
				const shootingGameObject = <IShootingGameObject>(<unknown>x);
				const bullet = shootingGameObject.spawnBullet();
				this.spawnGameObject(bullet);
				uiService.renderBullet(<GameObject>x, bullet);
			});
			setTimeout(spawnBullets, this.m_bulletSpawnTimeInMs);
		};
		setTimeout(spawnBullets, this.m_bulletSpawnTimeInMs);
	}

	public buyGameObject(gameObject: BuyableGameObject): void {
		this.buy(gameObject);
		this.m_gameObjects.push(gameObject);
	}
	public buy(option: IPricedObject): void {
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

	public bulletHitsGameObject(bullet: Bullet, gameObject: GameObject): void {
		if (gameObject && bullet) {
			if (gameObject.getHealth() - bullet.getAttackDamage() <= 0) {
				if (gameObject instanceof Enemy)
					this.m_player.awardCoins((<Enemy>gameObject).getCoins());

				this.removeGameObject(gameObject);
			} else {
				gameObject.takeDamage(bullet.getAttackDamage());
			}
			this.removeGameObject(bullet);
		}
	}

	public enemyHitsBuyableGameObject(enemy: Enemy, buyableGameObject: BuyableGameObject): void {
		if (enemy && buyableGameObject) {
			buyableGameObject.takeDamage(enemy.getAttackDamage());
			this.removeGameObject(enemy);

			if (buyableGameObject.getHealth() <= 0)
				this.removeGameObject(buyableGameObject);
		}
	}
	public enemyHitsPlayer(attackingGameObject: IAttackingGameObject): void {
		this.m_player.takeDamage(attackingGameObject.getAttackDamage());
	}

	public isGameOver = (): boolean => this.m_player.getHealth() <= 0;

	public getPlayerStatusInfo(): IPlayerStatusInfo {
		return {
			health: this.m_player.getHealth(),
			coins: this.m_player.getCoins()
		};
	}

	public getBuyableGameObjectById(id: number): BuyableGameObject | undefined {
		return <BuyableGameObject | undefined>this.m_gameObjects.find(x => x instanceof BuyableGameObject && x.getID() == id);
	}

	private getRandomNumber(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min) + min);
	}
	public getBaseGameObjects(): GameObjectBase[] {
		return this.m_gameObjects;
	}
	public getSpawnedGameObjects(): GameObject[] {
		return <GameObject[]>this.m_gameObjects.filter(x => x instanceof GameObject);
	}
	public getSpawnedBullets(): Bullet[] {
		return <Bullet[]>this.m_gameObjects.filter(x => x instanceof Bullet);
	}
	public getSpawnedEnemies(): Enemy[] {
		return <Enemy[]>this.m_gameObjects.filter(x => x instanceof Enemy);
	}
	public getSpawnedBuyableGameObjects(): BuyableGameObject[] {
		return <BuyableGameObject[]>this.m_gameObjects.filter(x => x instanceof BuyableGameObject);
	}
}
