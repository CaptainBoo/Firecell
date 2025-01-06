export default class Slime {
	constructor(scene, x, y) {
		this.scene = scene;

		this.sprite = scene.physics.add.sprite(x, y, 'slime', 0);
	}

	freeze() {
		this.sprite.body.moves = false;
	}

	update() {
		let destX = scene.Player.x;
		let destY = scene.Player.y;
		console.log(destX);
		console.log(destY);
	}

	destroy() {}
}
