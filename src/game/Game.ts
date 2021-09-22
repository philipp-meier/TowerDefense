import { IAttackingGameObject, IPlayerStatusInfo, IPricedObject, IShootingGameObject, IUIService } from "./Interfaces.js";
import { GameObject, GameObjectBase } from "./gameObjects/GameObjectBase.js";
import { AppConfig } from "./services/AppService.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";
import { PlayerGameObjectBase, Tower } from "./gameObjects/PlayerObjects.js";
import { Bullet } from "./gameObjects/Bullet.js";
import { EnemyBase, ShootingEnemy } from "./gameObjects/Enemies.js";
import { EnemyWaveService } from "./services/EnemyWaveService.js";

export class Game {
	private m_player: Player;
	private m_gameBoard: GameBoard;
	private m_gameObjects: GameObjectBase[] = [];
	private m_enemyWaveService: EnemyWaveService;
	private m_startTime = Date.now();

	private readonly m_bulletSpawnTimeInMs = 1000;

	constructor() {
		this.m_player = new Player();
		this.m_gameBoard = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
		this.m_enemyWaveService = new EnemyWaveService();
	}

	public start(uiService: IUIService): void {
		this.m_startTime = Date.now();
		this.m_enemyWaveService.init(this.m_startTime);

		uiService.renderAppTitle(AppConfig.appTitle);
		uiService.renderPlayerStatusBar(this.getPlayerStatusInfo());
		uiService.renderGameObjectSelectionBar();
		uiService.renderGameBoard(this.m_gameBoard);

		// Show game controls
		uiService.renderMessageWithTitle("Controls",
			`Left click = Buy selected game object<br>
			Right click = Upgrade existing game object<br>
			<br>
			Goal: Survive ${AppConfig.enemyWaveGoal} waves.`
		).then(() => {
			uiService.registerInteractionHandlers();

			// Start game
			this.bulletLoop(uiService);
			this.enemyLoop(uiService);
			this.updateLoop(uiService);
		});
	}
	private updateLoop(uiService: IUIService): void {
		if (this.isGameOver()) {
			// Restart by reloading the page.
			uiService.renderMessage(this.getGameOverText()).then(() => { window.location.reload() });
			return;
		}

		// Update wave
		this.m_enemyWaveService.updateWave();

		uiService.refreshUI();
		window.requestAnimationFrame(() => { this.updateLoop(uiService); });
	}
	private enemyLoop(uiService: IUIService): void {
		const spawnEnemies = () => {
			if (this.isGameOver())
				return;

			const enemy = this.m_enemyWaveService.spawnEnemy();
			this.spawnGameObject(enemy);
			uiService.renderEnemy(enemy);
			setTimeout(spawnEnemies, this.m_enemyWaveService.getEnemySpawnRateInSeconds());
		};
		setTimeout(spawnEnemies, this.m_enemyWaveService.getEnemySpawnRateInSeconds());
	}
	private bulletLoop(uiService: IUIService): void {
		const spawnBullets = () => {
			if (this.isGameOver())
				return;

			const lanesWithEnemies = this.getSpawnedEnemies().map(x => x.getLane());
			this.m_gameObjects.filter(x => x instanceof Tower || x instanceof ShootingEnemy).forEach((x) => {
				// Only shoot if enemy in sight
				if (x instanceof PlayerGameObjectBase && lanesWithEnemies.indexOf(x.getLane()) < 0)
					return;

				const shootingGameObject = <IShootingGameObject>(<unknown>x);
				const bullet = shootingGameObject.spawnBullet();
				this.spawnGameObject(bullet);
				uiService.renderBullet(<GameObject>x, bullet);
			});
			setTimeout(spawnBullets, this.m_bulletSpawnTimeInMs);
		};
		setTimeout(spawnBullets, this.m_bulletSpawnTimeInMs);
	}

	public buyGameObject(gameObject: PlayerGameObjectBase): void {
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
				if (gameObject instanceof EnemyBase)
					this.m_player.awardCoins((gameObject).getCoins());

				this.removeGameObject(gameObject);
			} else {
				gameObject.takeDamage(bullet.getAttackDamage());
			}
			this.removeGameObject(bullet);
		}
	}

	public enemyHitsPlayerGameObject(enemy: EnemyBase, playerGameObject: PlayerGameObjectBase): void {
		if (enemy && playerGameObject) {
			playerGameObject.takeDamage(enemy.getAttackDamage());
			this.removeGameObject(enemy);

			if (playerGameObject.getHealth() <= 0)
				this.removeGameObject(playerGameObject);
		}
	}
	public enemyHitsPlayer(attackingGameObject: IAttackingGameObject): void {
		this.m_player.takeDamage(attackingGameObject.getAttackDamage());
	}

	public isGameOver = (): boolean => this.m_player.getHealth() <= 0 || this.isGameWon();
	private isGameWon = (): boolean => this.m_enemyWaveService.getCurrentWave() >= AppConfig.enemyWaveGoal;
	public getGameOverText = (): string => this.isGameWon() ?
		"Congratulations! You survived all enemy waves!" :
		"Game Over";

	public getPlayerStatusInfo(): IPlayerStatusInfo {
		return {
			health: this.m_player.getHealth(),
			coins: this.m_player.getCoins(),
			startTime: this.m_startTime,
			currentWave: this.m_enemyWaveService.getCurrentWave()
		};
	}

	public getPlayerGameObjectById(id: number): PlayerGameObjectBase | undefined {
		return <PlayerGameObjectBase | undefined>this.getSpawnedPlayerGameObjects().find(x => x.getID() == id);
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
	public getSpawnedEnemies(): EnemyBase[] {
		return <EnemyBase[]>this.m_gameObjects.filter(x => x instanceof EnemyBase);
	}
	public getSpawnedPlayerGameObjects(): PlayerGameObjectBase[] {
		return <PlayerGameObjectBase[]>this.m_gameObjects.filter(x => x instanceof PlayerGameObjectBase);
	}
}
