import { Tower } from "../scripts/classes/Tower";
import { expect } from "chai";

describe('Tower', () => {
	it('should be initialised with tower_base.svg', () => {
		let tower = new Tower();
		expect(tower.svgName).to.equal('tower_base');
	});

	it('should be initialised with 100 health', () => {
		let tower = new Tower();
		expect(tower.health).to.equal(100);
	});

	it('should be initialised with 15 damage', () => {
		let tower = new Tower();
		expect(tower.damage).to.equal(15);
	});

	it('should be initialised with attack speed "1"', () => {
		let tower = new Tower();
		expect(tower.attackSpeed).to.equal(1);
	});

	it('should be initialised without upgrades', () => {
		let tower = new Tower();
		expect(tower.upgrades.length).to.equal(0);
	});
})
