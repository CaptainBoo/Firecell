export default class DungeonScene extends Phaser.Scene {
	preload() {
		this.load.image('tiles', 'assets/tilesets/DungeonTileset.png');
	}

	create() {
		const dungeon = new Dungeon({
			width: 50,
			height: 50,
			doorPadding: 2,
			randomSeed: 'fiftyseven',
			rooms: {
				width: { min: 9, max: 15, onlyOdd: true },
				height: { min: 9, max: 20, onlyOdd: true },
				maxRooms: 13,
			},
		});

		const map = this.make.tilemap({
			tileWidth: 16,
			tileHeight: 16,
			width: dungeon.width,
			height: dungeon.height,
		});

		const tileset = map.addTilesetImage('tiles', null, 16, 16);
		const layer = map.createBlankLayer('Layer 1', tileset);
		const mappedTiles = dungeon.getMappedTiles({
			empty: -1,
			floor: 98,
			door: 98,
			wall: 20,
		});
		layer.putTilesAt(mappedTiles, 0, 0);
		layer.setCollision(20); // We only need one tile index (the walls) to be colliding for now
	}

	update() {}
}
