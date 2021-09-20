/*
	Simple test environment.
*/
import { Player } from '../src/game/Player'
import { expect } from "chai";

describe('Player', () => {
	it('should be initialised with 100 health', () => {
		const player = new Player();
		expect(player.getHealth()).to.equal(100);
	});

	it('should be initialised with 200 coins', () => {
		const player = new Player();
		expect(player.getCoins()).to.equal(200);
	});

	it('should be awarded 100 coins', () => {
		const player = new Player();
		const coins = player.getCoins();
		player.awardCoins(100);
		expect(player.getCoins()).to.equal(coins + 100);
	});

	it('should reduce coins by 100', () => {
		const player = new Player();
		const coins = player.getCoins();
		player.buyItem({ getPrice: () => { return 100; } });
		expect(player.getCoins()).to.equal(coins - 100);
	});

	it('should reduce health by 50', () => {
		const player = new Player();
		const health = player.getHealth();
		player.takeDamage(50);
		expect(player.getHealth()).to.equal(health - 50);
	});

	it('should set health to 0', () => {
		const player = new Player();
		player.takeDamage(500);
		expect(player.getHealth()).to.equal(0);
	});
})
