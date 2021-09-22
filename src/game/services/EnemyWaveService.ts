import { Enemy, IWaveDependentValues, ShootingEnemy } from "../gameObjects/Enemies.js";
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
		const waveDependentWalues: IWaveDependentValues = {
			attackDamage: this.calcValueByWave(20, 20),
			attackSpeed: this.calcValueByWave(5, 10),
			health: this.calcValueByWave(100, 30),
			maxHealth: this.calcValueByWave(100, 30)
		};

		return this.m_currentWave >= 2 && (this.getRandomNumber(0, 50) >= 25) ?
			new ShootingEnemy(this.m_currentWave, this.getRandomNumber(0, AppConfig.rowCount), waveDependentWalues) :
			new Enemy(this.m_currentWave, this.getRandomNumber(0, AppConfig.rowCount), waveDependentWalues);
	}

	public calcValueByWave(value: number, percentIncrPerWave: number): number {
		if (this.m_currentWave <= 1)
			return value;

		return value + ((value / 100) * percentIncrPerWave * this.m_currentWave);
	}

	public getEnemySpawnRateInSeconds = (): number => this.m_enemySpawnTimeInMs;
	public getCurrentWave = (): number => this.m_currentWave;

	private getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);
}
