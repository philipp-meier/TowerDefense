import { Enemy, EnemyBase, IWaveDependentValues, ShootingEnemy } from "../gameObjects/Enemies.js";
import { AppConfig } from "./AppService.js";

export class EnemyWaveService {
	private m_currentWave = 1;
	private m_startTime: number = Date.now();

	private readonly m_waveDurationInMinutes = 1;
	private readonly m_enemySpawnTimeInMs = 3000;

	public init(startTime: number): void {
		this.m_startTime = startTime;
	}

	public updateWave(): void {
		this.m_currentWave = 1 + Math.trunc((Date.now() - this.m_startTime) / (this.m_waveDurationInMinutes * 60000));
	}

	public spawnEnemy(): EnemyBase {
		const waveDependentWalues: IWaveDependentValues = {
			health: this.calcValueByWave(100, 30),
			maxHealth: this.calcValueByWave(100, 30),
			attackDamage: this.calcValueByWave(25, 20),
			attackSpeed: 5
		};

		return this.m_currentWave >= 2 && (this.getRandomNumber(0, 100) >= 50) ?
			new ShootingEnemy(this.getRandomNumber(0, AppConfig.rowCount), waveDependentWalues) :
			new Enemy(this.getRandomNumber(0, AppConfig.rowCount), waveDependentWalues);
	}

	public calcValueByWave(value: number, percentIncrPerWave: number): number {
		if (this.m_currentWave <= 1)
			return value;

		return value + ((value / 100) * percentIncrPerWave * this.m_currentWave);
	}

	public getEnemySpawnRateInSeconds = (): number => this.m_enemySpawnTimeInMs - (this.m_currentWave * 200);
	public getCurrentWave = (): number => this.m_currentWave;

	private getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);
}
