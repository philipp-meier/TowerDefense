import { Tower } from "../src/classes/Tower";
import { expect } from "chai";

describe('Tower', () => {
	it('should be initialised with Tower/level1.svg', () => {
		let tower = new Tower();
		expect(tower.getSvg()).to.equal('Tower/level1.svg');
	});

	it('should be initialised with 100 health', () => {
		let tower = new Tower();
		expect(tower.getHealth()).to.equal(100);
	});

	it('should be initialised with 15 damage', () => {
		let tower = new Tower();
		expect(tower.getDamage()).to.equal(15);
	});

	it('should be initialised with attack speed "1"', () => {
		let tower = new Tower();
		expect(tower.getAttackSpeed()).to.equal(1);
	});
})
