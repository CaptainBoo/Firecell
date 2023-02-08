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

const dungeon = new Dungeon({
	// The dungeon's grid size
	width: 40,
	height: 40,
	rooms: {
		// Random range for the width of a room (grid units)
		width: {
			min: 5,
			max: 10,
		},
		// Random range for the height of a room (grid units)
		height: {
			min: 8,
			max: 20,
		},
		// Cap the area of a room - e.g. this will prevent large rooms like 10 x 20
		maxArea: 150,
		// Max rooms to place
		maxRooms: 10,
	},
});

const html = dungeon.drawToHtml({
	empty: ' ',
	wall: '📦',
	floor: '☁️',
	door: '🚪',
});

// Append the element to an existing element on the page
document.body.appendChild(html);
