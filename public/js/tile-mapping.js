const TILE_MAPPING = {
	WALL: {
		TOP_LEFT: 110,
		TOP_RIGHT: 111,
		BOTTOM_RIGHT: 125,
		BOTTOM_LEFT: 124,
		// Let's add some randomization to the walls while we are refactoring:
		TOP: [
			{ index: 0, weight: 4 },
			{ index: [1, 2, 3, 4, 5], weight: 1 },
		],
		LEFT: [
			{ index: 90, weight: 4 },
			{ index: [91, 92, 93, 94, 95], weight: 1 },
		],
		RIGHT: [
			{ index: 84, weight: 4 },
			{ index: [85, 86, 87, 88, 89], weight: 1 },
		],
		BOTTOM: [
			{ index: 42, weight: 4 },
			{ index: [43, 44, 45, 46, 47], weight: 1 },
		],
	},
	FLOOR: [
		{ index: 184, weight: 9 },
		{ index: [199, 200, 201, 202], weight: 1 },
	],
	// POT: [
	// 	{ index: 13, weight: 1 },
	// 	{ index: 32, weight: 1 },
	// 	{ index: 51, weight: 1 },
	// ],
	DOOR: {
		TOP: [97, 184, 96],
		LEFT: [[97], [184], [83]],
		BOTTOM: [83, 184, 82],
		RIGHT: [[96], [184], [82]],
	},
	// CHEST: 166,
	// STAIRS: 81,
	// TOWER: [[186], [205]],
};

export default TILE_MAPPING;
