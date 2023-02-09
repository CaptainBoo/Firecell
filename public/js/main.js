import DungeonScene from "./dungeon-scene.js";

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 480,
	backgroundColor: '#222222',
    parent: "game-container",
	pixelArt: true,
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
	physics: {
		default: 'arcade',
		arcade: {
			tileBias: 4,
		},
	},
};

var game = new Phaser.Game(config);

function preload() {}

function create() {}

function update() {}