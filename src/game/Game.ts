/*
	=== Game ===
	Contains the core logic of the game (Goal, GameObjects, Rules, Logic).
*/
import { IAttackingGameObject, IPlayerStatusInfo, IPricedObject, IShootingGameObject, IUIService } from "./Interfaces.js";
import { GameObject, GameObjectBase } from "./gameObjects/GameObjectBase.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";
import { PlayerGameObjectBase, Rampart, Tower } from "./gameObjects/PlayerObjects.js";
import { Bullet } from "./gameObjects/Bullet.js";
import { EnemyBase, ShootingEnemy } from "./gameObjects/Enemies.js";
import { EnemyWaveService } from "./services/EnemyWaveService.js";
import { GameSettings } from "./GameSettings.js";
import { CollisionService } from "./services/CollisionService.js";

export class Game {
	private m_player: Player;
	private m_gameBoard: GameBoard;
	private m_gameObjects: GameObjectBase[] = [];
	private m_enemyWaveService: EnemyWaveService;
	private m_startTime = Date.now();

	constructor() {
		this.m_player = new Player();
		this.m_gameBoard = new GameBoard(GameSettings.rowCount, GameSettings.columnCount);
		this.m_enemyWaveService = new EnemyWaveService();
	}

	public start(uiService: IUIService): void {
		uiService.init();

		// Show game controls
		uiService.renderMessageWithTitle("Controls",
			`Left click = Buy selected game object<br>
			Right click = Upgrade existing game object<br>
			<br>
			Goal: Survive ${GameSettings.goalInEnemyWaves} waves.`
		).then(() => {
			this.m_startTime = Date.now();
			this.m_enemyWaveService.init(this.m_startTime);

			// Sets up the user interaction service
			uiService.registerInteractionHandlers();

			// Start game
			this.enemyLoop();
			this.updateLoop(uiService);
		});
	}

	public buyGameObject(classIdentifier: string, lane: number, positionX: number): number {
		const gameObject = classIdentifier === "Tower" ?
			new Tower(lane, positionX) :
			new Rampart(lane, positionX);

		this.buy(gameObject);
		this.m_gameObjects.push(gameObject);

		return gameObject.getID();
	}
	public buy(option: IPricedObject): void {
		this.m_player.buyItem(option);
	}

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

	public getGameBoard = (): GameBoard => this.m_gameBoard;
	public getSelectableGameObjectTemplates = (): PlayerGameObjectBase[] => [new Tower(0, 0), new Rampart(0, 0)];
	public getSpawnedBaseGameObjects = (): GameObjectBase[] => this.m_gameObjects;

	private updateLoop(uiService: IUIService): void {
		if (this.isGameOver()) {
			// Restart by reloading the page.
			uiService.renderMessage(this.getGameOverText()).then(() => { window.location.reload() });
			return;
		}

		// Update wave
		this.m_enemyWaveService.updateWave();

		// Bullets
		this.updateBullets();

		// Collisions
		this.updateCollisions();

		this.m_gameObjects.forEach((gameObject) => gameObject.update());

		uiService.refreshUI();
		window.requestAnimationFrame(() => { this.updateLoop(uiService); });
	}
	private updateCollisions(): void {
		this.getSpawnedBullets().forEach((bullet) => {
			this.getSpawnedGameObjects().forEach((gameObject) => {
				// Disable "friendly fire".
				if ((gameObject instanceof PlayerGameObjectBase && bullet.isEnemyBullet()) ||
					gameObject instanceof EnemyBase && !bullet.isEnemyBullet()) {

					if (CollisionService.isColliding(bullet, gameObject))
						this.bulletHitsGameObject(bullet, gameObject);
				}
			});

			const positionX = bullet.getPositionX();
			const width = GameSettings.singleFieldWidth;
			const isBeyondBorder = bullet.isEnemyBullet() ?
				((positionX + width) <= 0) :
				((positionX + width) >= GameSettings.fieldWidth);

			if (isBeyondBorder) {
				if (bullet.isEnemyBullet())
					this.enemyHitsPlayer(bullet);

				this.removeGameObject(bullet);
			}
		});

		this.getSpawnedEnemies().forEach((enemy) => {
			if (enemy.getPositionX() <= 0) {
				this.enemyHitsPlayer(enemy);
				this.removeGameObject(enemy);
			}

			// Collides with player game object (tower,..)
			this.getSpawnedPlayerGameObjects().forEach((gameObject) => {
				if (CollisionService.isColliding(enemy, gameObject)) {
					this.enemyHitsPlayerGameObject(enemy, gameObject);
				}
			});
		});
	}
	private updateBullets(): void {
		const lanesWithEnemies = this.getSpawnedEnemies().map(x => x.getLane());
		this.m_gameObjects.filter(x => x instanceof Tower || x instanceof ShootingEnemy).forEach((x) => {
			const shootingGameObject = <IShootingGameObject>(<unknown>x);
			if (!shootingGameObject.isBulletSpawnable())
				return;

			// Only shoot if enemy is in sight
			if (x instanceof PlayerGameObjectBase && lanesWithEnemies.indexOf(x.getLane()) < 0)
				return;

			const bullet = shootingGameObject.spawnBullet();
			this.spawnGameObject(bullet);
		});
	}
	private enemyLoop(): void {
		const spawnEnemies = () => {
			if (this.isGameOver())
				return;

			const enemy = this.m_enemyWaveService.spawnEnemy();
			this.spawnGameObject(enemy);
			setTimeout(spawnEnemies, this.m_enemyWaveService.getEnemySpawnRateInSeconds());
		};
		setTimeout(spawnEnemies, this.m_enemyWaveService.getEnemySpawnRateInSeconds());
	}

	private spawnGameObject(gameObject: GameObjectBase): void {
		this.m_gameObjects.push(gameObject);
	}
	private removeGameObject(gameObject: GameObjectBase): void {
		const item = this.m_gameObjects.find(x => x.getID() == gameObject.getID());
		if (item) {
			const index = this.m_gameObjects.indexOf(item);
			this.m_gameObjects.splice(index, 1);
		}
	}

	private bulletHitsGameObject(bullet: Bullet, gameObject: GameObject): void {
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
	private enemyHitsPlayerGameObject(enemy: EnemyBase, playerGameObject: PlayerGameObjectBase): void {
		if (enemy && playerGameObject) {
			playerGameObject.takeDamage(enemy.getAttackDamage());
			this.removeGameObject(enemy);

			if (playerGameObject.getHealth() <= 0)
				this.removeGameObject(playerGameObject);
		}
	}
	private enemyHitsPlayer(attackingGameObject: IAttackingGameObject): void {
		this.m_player.takeDamage(attackingGameObject.getAttackDamage());
	}

	private isGameOver = (): boolean => this.m_player.getHealth() <= 0 || this.isGameWon();
	private isGameWon = (): boolean => this.m_enemyWaveService.getCurrentWave() >= GameSettings.goalInEnemyWaves + 1;
	private getGameOverText = (): string => this.isGameWon() ?
		"Congratulations! You survived all enemy waves!" :
		"Game Over";

	private getSpawnedGameObjects(): GameObject[] {
		return <GameObject[]>this.m_gameObjects.filter(x => x instanceof GameObject);
	}
	private getSpawnedBullets(): Bullet[] {
		return <Bullet[]>this.m_gameObjects.filter(x => x instanceof Bullet);
	}
	private getSpawnedEnemies(): EnemyBase[] {
		return <EnemyBase[]>this.m_gameObjects.filter(x => x instanceof EnemyBase);
	}
	private getSpawnedPlayerGameObjects(): PlayerGameObjectBase[] {
		return <PlayerGameObjectBase[]>this.m_gameObjects.filter(x => x instanceof PlayerGameObjectBase);
	}
}
