import { Enemy } from "../gameObjects/Enemy.js";
import { ShootingEnemy } from "../gameObjects/ShootingEnemy.js";
import { AppConfig } from "./AppService.js";

export class EnemyWaveService {
	private m_currentWave = 1;
	private m_startTime: number = Date.now();

	private readonly m_waveDurationInMinutes = 1;
	private readonly m_enemySpawnTimeInMs = 10_000;

	public init(startTime: number): void {
		this.m_startTime = startTime;
	}

	public updateWave(): void {
		this.m_currentWave = 1 + Math.trunc((Date.now() - this.m_startTime) / (this.m_waveDurationInMinutes * 60000));
	}

	public spawnEnemy(): Enemy {
		return this.m_currentWave >= 5 && (this.getRandomNumber(0, 50) >= 25) ?
			new ShootingEnemy(this.m_currentWave, this.getRandomNumber(0, AppConfig.rowCount)) :
			new Enemy(this.m_currentWave, this.getRandomNumber(0, AppConfig.rowCount));
	}

	public getEnemySpawnRateInSeconds = (): number => this.m_enemySpawnTimeInMs;
	public getCurrentWave = (): number => this.m_currentWave;

	private getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);
}
