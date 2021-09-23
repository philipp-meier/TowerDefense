export const GameSettings = {
	// Objective / Goal
	goalInEnemyWaves: 5,

	// General
	appTitle: "Tower Defense",
	waveDurationInMinutes: 1,
	fieldWidth: 1200,
	fieldHeight: 600,
	rowCount: 6,
	columnCount: 12,
	svgPath: "img/",

	// Spawn time
	enemySpawnTimeInMs: 3000,
	enemySpawnTimeDecreasePerWaveInMs: 200,
	bulletSpawnTimeInMs: 300,

	// Player configuration
	playerCoinsStart: 200,
	playerHealthStart: 100,

	// === Player Game Objects ===
	// Tower
	towerHealth: 100,
	towerAttackDamage: 5,
	towerAttackSpeed: 8,
	towerPrice: 50,
	towerRepairPrice: 50,
	towerUpgradeDamageIncrease: 10,
	towerUpgrade1Price: 50,
	towerUpgrade2Price: 100,

	// Rampart
	rampartHealth: 250,
	rampartPrice: 50,
	rampartRepairPrice: 50,

	// === Enemy Game Objects ===
	// Enemy
	enemyHealth: 100,
	enemyAttackDamage: 25,
	enemyHealthIncreasePerWaveInPercent: 30,
	enemyDamageIncreasePerWaveInPercent: 20,

	// Shooting Enemy
	shootingEnemyHealth: 100,
	shootingEnemyAttackDamage: 8,
	shootingEnemyAttackSpeed: 5,
	shootingEnemyHealthIncreasePerWaveInPercent: 30,
	shootingEnemyDamageIncreasePerWaveInPercent: 20,
};
