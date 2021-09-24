/*
	=== Enemy Wave Service ===
	Is responsible for keeping track of the current enemy wave and enemy wave adjustments.
	This service decides which enemy will be spawned and defines the corresponding (attack-)values.
*/
import { Enemy, EnemyBase, ShootingEnemy } from "../gameObjects/Enemies.js";
import { GameSettings } from "../GameSettings.js";

export class EnemyWaveService {
	private m_currentWave = 1;
	private m_startTime: number = Date.now();

	public init(startTime: number): void {
		this.m_startTime = startTime;
	}

	public updateWave(): void {
		this.m_currentWave = 1 + Math.trunc((Date.now() - this.m_startTime) / (GameSettings.waveDurationInMinutes * 60000));
	}

	public spawnEnemy(): EnemyBase {
		const spawnLane = this.getRandomNumber(0, GameSettings.rowCount);

		if (this.m_currentWave >= 2 && this.getRandomNumber(0, 100) >= 50) {
			return new ShootingEnemy(spawnLane, {
				health: this.calcValueByWave(GameSettings.shootingEnemyHealth, GameSettings.shootingEnemyHealthIncreasePerWaveInPercent),
				attackDamage: this.calcValueByWave(GameSettings.shootingEnemyAttackDamage, GameSettings.shootingEnemyDamageIncreasePerWaveInPercent),
				attackSpeed: GameSettings.shootingEnemyAttackSpeed
			});
		}
		else {
			return new Enemy(spawnLane, {
				health: this.calcValueByWave(GameSettings.enemyHealth, GameSettings.enemyHealthIncreasePerWaveInPercent),
				attackDamage: this.calcValueByWave(GameSettings.enemyAttackDamage, GameSettings.enemyDamageIncreasePerWaveInPercent),
				attackSpeed: 1
			});
		}
	}

	private getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);
	private calcValueByWave(value: number, percentIncrPerWave: number): number {
		if (this.m_currentWave <= 1)
			return value;

		return value + ((value / 100) * percentIncrPerWave * this.m_currentWave);
	}

	public getEnemySpawnRateInSeconds = (): number => GameSettings.enemySpawnTimeInMs - (this.m_currentWave * GameSettings.enemySpawnTimeDecreasePerWaveInMs);
	public getCurrentWave = (): number => this.m_currentWave;
}
