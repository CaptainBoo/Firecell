import Dungeon from '@mikewesthad/dungeon';
import Player from './player.js';
import Slime from './slime.js';
import TILES from './tile-mapping.js';

// URLs for parcel
import characterSpritesheetURL from '../assets/buch-characters-64px-extruded.png';
import slimeURL from '../assets/mysticwoodspack/characters/slime.png';
import tilesetURL from '../assets/tilesets/buch-zelda-style-tileset-32px.png';

export default class DungeonScene extends Phaser.Scene {
	preload() {
		this.load.image('tiles', tilesetURL);
		this.load.spritesheet('characters', characterSpritesheetURL, {
			frameWidth: 64,
			frameHeight: 64,
			margin: 1,
			spacing: 2,
		});
		this.load.spritesheet('slime', slimeURL, {
			frameWidth: 64,
			frameHeight: 64,
			margin: 0,
			spacing: 8,
		});
	}
	create() {
		this.dungeon = new Dungeon({
			width: 50,
			height: 50,
			doorPadding: 2,
			// randomSeed: 'fiftyseven',
			rooms: {
				width: { min: 9, max: 15, onlyOdd: true },
				height: { min: 9, max: 15, onlyOdd: true },
			},
		});

		const map = this.make.tilemap({
			tileWidth: 32,
			tileHeight: 32,
			width: this.dungeon.width,
			height: this.dungeon.height,
		});
		const tileset = map.addTilesetImage('tiles', null, 32, 32);
		const layer = map.createBlankLayer('Layer 1', tileset);

		this.groundLayer = map.createBlankLayer('Ground', tileset); // Wall & floor
		this.stuffLayer = map.createBlankLayer('Stuff', tileset); // Chest, stairs, etc.

		// Set all tiles in the ground layer with blank tiles (purple-black tile)
		this.groundLayer.fill(41);

		// Use the array of rooms generated to place tiles in the map
		// Note: using an arrow function here so that "this" still refers to our scene
		this.dungeon.rooms.forEach((room) => {
			const { x, y, width, height, left, right, top, bottom } = room;

			// Fill the floor with mostly clean tiles
			this.groundLayer.weightedRandomize(
				TILES.FLOOR,
				x + 1,
				y + 1,
				width - 2,
				height - 2
			);

			// Place the room corners tiles
			this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
			this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
			this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
			this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

			// Fill the walls with mostly clean tiles
			this.groundLayer.weightedRandomize(
				TILES.WALL.TOP,
				left + 1,
				top,
				width - 2,
				1
			);
			this.groundLayer.weightedRandomize(
				TILES.WALL.BOTTOM,
				left + 1,
				bottom,
				width - 2,
				1
			);
			this.groundLayer.weightedRandomize(
				TILES.WALL.LEFT,
				left,
				top + 1,
				1,
				height - 2
			);
			this.groundLayer.weightedRandomize(
				TILES.WALL.RIGHT,
				right,
				top + 1,
				1,
				height - 2
			);

			// Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
			// room's location. Each direction has a different door to tile mapping.
			const doors = room.getDoorLocations(); // → Returns an array of {x, y} objects
			for (let i = 0; i < doors.length; i++) {
				if (doors[i].y === 0) {
					this.groundLayer.putTilesAt(
						TILES.DOOR.TOP,
						x + doors[i].x - 1,
						y + doors[i].y
					);
				} else if (doors[i].y === room.height - 1) {
					this.groundLayer.putTilesAt(
						TILES.DOOR.BOTTOM,
						x + doors[i].x - 1,
						y + doors[i].y
					);
				} else if (doors[i].x === 0) {
					this.groundLayer.putTilesAt(
						TILES.DOOR.LEFT,
						x + doors[i].x,
						y + doors[i].y - 1
					);
				} else if (doors[i].x === room.width - 1) {
					this.groundLayer.putTilesAt(
						TILES.DOOR.RIGHT,
						x + doors[i].x,
						y + doors[i].y - 1
					);
				}
			}
		});

		// Not exactly correct for the tileset since there are more possible floor tiles, but this will
		// do for the example.
		this.groundLayer.setCollisionByExclusion([184, 199, 200, 201, 202]);

		this.player = new Player(
			this,
			map.widthInPixels / 2,
			map.heightInPixels / 2
		);

		this.slime = new Slime(
			this,
			map.widthInPixels / 2,
			map.heightInPixels / 2,
		);

		// Watch the player and layer for collisions, for the duration of the scene:
		this.physics.add.collider(this.player.sprite, this.groundLayer);

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

		// Debug collision graphics
		// const debugGraphics = this.add.graphics().setAlpha(0.75);
		// this.groundLayer.renderDebug(debugGraphics, {
		//   tileColor: null, // Color of non-colliding tiles
		//   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
		//   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		// });
	}

	update(time, delta) {
		this.player.update();
	}
}
