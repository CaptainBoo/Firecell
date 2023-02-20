(function () {
	// generate map
	var mapSize = { x: 50, y: 50 };
	var map = generateLevel(mapSize, 25, 4, 16);

	// create canvas to draw map on
	var canvas = document.createElement('CANVAS');
	canvas.width = mapSize.x * 10;
	canvas.height = mapSize.y * 10;
	canvas.style.width = mapSize.x * 10 + 'px';
	canvas.style.height = mapSize.y * 10 + 'px';
	document.body.append(canvas);

	// draw map
	var ctx = canvas.getContext('2d');
	for (var i = 0; i < mapSize.x; ++i) {
		for (var j = 0; j < mapSize.y; ++j) {
			ctx.fillStyle = map.tiles[i][j] ? '#ccc' : '#00ffaa';
			ctx.fillRect(i * 10, j * 10, 10, 10);
		}
	}

	// draw all doors
	ctx.fillStyle = '#22bbaa';
	for (var i = 0; i < map.doors.length; ++i) {
		ctx.fillRect(map.doors[i].x * 10, map.doors[i].y * 10, 10, 10);
	}
})();
