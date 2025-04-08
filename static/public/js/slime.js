export default class Slime {
	constructor(scene, x, y, player) {
		this.scene = scene;
		this.player = player;

		this.sprite = scene.physics.add.sprite(x, y, 'slime', 0);
		this.sprite.setScale(3);

		// Initialize pathfinding properties
		this.path = [];
		this.pathIndex = 0;

		// Initialize the animation to avoid null currentAnim
		this.sprite.anims.play('slime_idle');
	}

	freeze() {
		this.sprite.body.moves = false;
	}

	update() {
		const playerX = Math.floor(this.player.sprite.x / 32);
		const playerY = Math.floor(this.player.sprite.y / 32);
		const slimeX = Math.floor(this.sprite.x / 32);
		const slimeY = Math.floor(this.sprite.y / 32);

		// Check if the slime needs a new path
		if (this.path.length === 0 || this.pathIndex >= this.path.length) {
			this.scene.easystar.findPath(
				slimeX,
				slimeY,
				playerX,
				playerY,
				(path) => {
					if (path) {
						this.path = path;
						this.pathIndex = 0;
						console.log('New path found:', path);
					} else {
						console.log('No path found');
					}
				}
			);
			this.scene.easystar.calculate();
		}

		// Follow the path
		if (this.path.length > 0 && this.pathIndex < this.path.length) {
			const nextPoint = this.path[this.pathIndex];
			const nextX = nextPoint.x * 32;
			const nextY = nextPoint.y * 32;

			const directionX = nextX - this.sprite.x;
			const directionY = nextY - this.sprite.y;

			const magnitude = Math.sqrt(
				directionX * directionX + directionY * directionY
			);

			if (magnitude < 4) {
				this.pathIndex++;
			} else {
				const normalizedX = directionX / magnitude;
				const normalizedY = directionY / magnitude;

				const speed = 100; // Adjust the speed as needed
				this.sprite.body.setVelocity(
					normalizedX * speed,
					normalizedY * speed
				);

				// Determine the appropriate animation based on the velocity
				const isMoving = normalizedX !== 0 || normalizedY !== 0;
				const currentAnimKey = this.sprite.anims.currentAnim
					? this.sprite.anims.currentAnim.key
					: null;
				const targetAnimKey = isMoving ? 'slime_walk' : 'slime_idle';

				// Play the animation if it's not already playing
				if (currentAnimKey !== targetAnimKey) {
					this.sprite.anims.play(targetAnimKey);
				}
			}
		} else {
			this.sprite.body.setVelocity(0, 0);
		}

		console.log(`Slime position: (${this.sprite.x}, ${this.sprite.y})`);
		console.log('Current path:', this.path);
		console.log('Current path index:', this.pathIndex);
	}

	destroy() {}
}
