import Player from './player.js';

/**
 * Scene that generates a new dungeon
 */
export default class DungeonScene extends Phaser.Scene {
	preload() {
		this.load.image('tiles', '../assets/tilesets/DungeonTileset.png');
		this.load.spritesheet(
			'characters',
			'../assets/spritesheets/buch-characters-64px-extruded.png',
			{
				frameWidth: 64,
				frameHeight: 64,
				margin: 1,
				spacing: 2,
			}
		);
	}

	create() {
		// Generate a random world
		this.dungeon = new Dungeon({
			width: 50,
			height: 50,
			doorPadding: 2,
			rooms: {
				width: { min: 7, max: 15, onlyOdd: true },
				height: { min: 7, max: 15, onlyOdd: true },
			},
		});

		// Create a blank tilemap with dimensions matching the dungeon
		const map = this.make.tilemap({
			tileWidth: 48,
			tileHeight: 48,
			width: dungeon.width,
			height: dungeon.height,
		});
		const tileset = map.addTilesetImage('tiles', null, 48, 48, 1, 2); // 1px margin, 2px spacing
		this.groundLayer = map.createBlankLayer('Ground', tileset); // Wall & floor
		this.stuffLayer = map.createBlankLayer('Stuff', tileset); // Chest, stairs, etc.
		const layer = map.createBlankLayer('Layer 1', tileset);

		// Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
		// blank layer
		const mappedTiles = dungeon.getMappedTiles({
			empty: -1,
			floor: 6,
			door: 6,
			wall: 20,
		});
		layer.putTilesAt(mappedTiles, 0, 0);
		layer.setCollision(20); // We only need one tile index (the walls) to be colliding for now

		// Place the player in the center of the map. This works because the Dungeon generator places
		// the first room in the center of the map.
		this.player = new Player(
			this,
			map.widthInPixels / 2,
			map.heightInPixels / 2
		);

		// Watch the player and layer for collisions, for the duration of the scene:
		this.physics.add.collider(this.player.sprite, layer);

		// Phaser supports multiple cameras, but you can access the default camera like this:
		const camera = this.cameras.main;
		camera.startFollow(this.player.sprite);
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		// Help text that has a "fixed" position on the screen
		this.add
			.text(16, 16, 'Arrow keys to move', {
				font: '18px monospace',
				fill: '#000000',
				padding: { x: 20, y: 10 },
				backgroundColor: '#ffffff',
			})
			.setScrollFactor(0);
		// Set all tiles in the ground layer with blank tiles (purple-black tile)
		this.groundLayer.fill(20);

		// Use the array of rooms generated to place tiles in the map
		// Note: using an arrow function here so that "this" still refers to our scene
		this.dungeon.rooms.forEach((room) => {
			// These room properties are all in grid units (not pixels units)
			const { x, y, width, height, left, right, top, bottom } = room;

			// Fill the room (minus the walls) with mostly clean floor tiles (90% of the time), but
			// occasionally place a dirty tile (10% of the time).
			this.groundLayer.weightedRandomize(
				[
					{ index: 6, weight: 9 }, // 9/10 times, use index 6
					{ index: [7, 8, 26], weight: 1 }, // 1/10 times, randomly pick 7, 8 or 26
				],
				x + 1,
				y + 1,
				width - 2,
				height - 2
			);

			// Place the room corners tiles
			this.groundLayer.putTileAt(3, left, top);
			this.groundLayer.putTileAt(4, right, top);
			this.groundLayer.putTileAt(23, right, bottom);
			this.groundLayer.putTileAt(22, left, bottom);

			// Place the non-corner wall tiles using fill with x, y, width, height parameters
			this.groundLayer.fill(39, left + 1, top, width - 2, 1); // Top
			this.groundLayer.fill(1, left + 1, bottom, width - 2, 1); // Bottom
			this.groundLayer.fill(21, left, top + 1, 1, height - 2); // Left
			this.groundLayer.fill(19, right, top + 1, 1, height - 2); // Right
		});
	}

	update(time, delta) {
		this.player.update();
	}
}
