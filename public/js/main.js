var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game-container',
	pixelArt: true,
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
};

var game = new Phaser.Game(config);

function preload() {
	this.load.image('tile', 'assets/tilesets/DungeonTileset.png');
}

function create() {}

function update() {}
