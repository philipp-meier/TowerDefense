import { IGameObjectOption, IPlayerStatusInfo, IUIService } from "../Interfaces.js";
import { BuyableGameObject, GameObject } from "./GameObjects.js";
import { AppConfig } from "../services/AppService.js";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";
import { Tower } from "./Tower.js";
import { Bullet } from "./Bullet.js";

export class Game {
	private m_player: Player;
	private m_gameBoard: GameBoard;
	private m_gameObjects: GameObject[] = [];
	private m_spawnedBullets: Bullet[] = [];

	constructor() {
		this.m_player = new Player();
		this.m_gameBoard = new GameBoard(AppConfig.rowCount, AppConfig.columnCount);
	}

	public start(uiService: IUIService): void {
		uiService.renderAppTitle(AppConfig.appTitle);
		uiService.renderPlayerStatusBar(this.getPlayerStatusInfo());
		uiService.renderGameBoard(this.m_gameBoard);

		this.bulletLoop(uiService);
		this.updateLoop(uiService);
	}
	private updateLoop(uiService: IUIService): void {
		uiService.refreshUI();
		window.requestAnimationFrame(() => { this.updateLoop(uiService); });
	}
	private bulletLoop(uiService: IUIService): void {
		const spawnBullets = () => {
			this.m_gameObjects.filter(x => x instanceof Tower).forEach((x) => {
				const tower = <Tower>x;
				const bullet = tower.spawnBullet();
				uiService.renderBullet(tower, bullet);
				this.spawnBullet(bullet);
			});
			setTimeout(spawnBullets, 5000);
		};
		setTimeout(spawnBullets, 5000);
	}

	public buyGameObject(gameObject: BuyableGameObject): void {
		// TODO: Object should not be created at all, if it is too expensive.
		this.m_player.buyItem(gameObject);
		this.m_gameObjects.push(gameObject);
	}
	public buyGameObjectOption(option: IGameObjectOption): void {
		this.m_player.buyItem(option);
	}
	public spawnBullet(bullet: Bullet): void {
		this.m_spawnedBullets.push(bullet);
	}
	public removeBullet(bullet: Bullet): void {
		const index = this.m_spawnedBullets.indexOf(bullet);
		if (index > 0)
			this.m_spawnedBullets.splice(index, 1);
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
	public getSpawnedBullets(): Bullet[] {
		return this.m_spawnedBullets;
	}
}
