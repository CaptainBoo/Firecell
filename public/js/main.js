import Phaser from 'phaser';
import DungeonScene from './DungeonScene.js';

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game-container',
	pixelArt: true,
	scene: DungeonScene,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
};

var game = new Phaser.Game(config);
