// generate a random level with rooms
// mapSize = level size {x, y}
// maxRooms = max number of rooms to generate (number). note: under some conditions the result will have less rooms than max rooms, for example if we run out of places to place rooms in.
// minRoomSize = min room size (number).
// maxRoomSize = max room size (number).
// base on the concepts found here: https://medium.com/@victorcatalintorac/dungeon-with-rooms-algorithm-for-javascript-ultimate-begginer-guide-ec1489e90314
// author: Ronen Ness.
// feel free to use this for any purpose.
// NOTE: made for a project on http://5mbg.com/.
function generateLevel(mapSize, maxRooms, minRoomSize, maxRoomSize) {
  
	// defaults
	maxRooms = maxRooms || 12;
	minRoomSize = minRoomSize || 4;
	maxRoomSize = maxRoomSize || 14;
	
	// create empty grid of walls (1 == wall)
	var ret = [];
	for (var i = 0; i < mapSize.x; ++i) {
	  ret.push([])
	  for (var j = 0; j < mapSize.y; ++j) {
		ret[i].push(1);
	  }
	}
  
	// set a room as floors (0)
	function setFloor(room)
	{
	  var x = room.x;
	  var y = room.y;
	  var w = room.w;
	  var h = room.h;
	  for (var i = x; i < x + w; ++i) {
		  for (var j = y; j < y + h; ++j) {
				ret[i][j] = 0;
		  }
		}
	}
  
	// rooms left to create
	var roomsLeft = maxRooms - 1;
  
	// check if a given room is valid - don't exit map and don't overlap another room
	function isValid(room)
	{
	  var x = room.x;
	  var y = room.y;
	  var w = room.w;
	  var h = room.h;
  
	  // ran out of rooms?
	  if (roomsLeft <= 0) { return false; }
	  
	  // check boundaries
	  if (x < 0 || x + w >= mapSize.x) { return false; }
	  if (y < 0 || y + h >= mapSize.y) { return false; }
	  
	  // make sure there are no floors, ie not overlapping with another room
	  for (var i = x-1; i < x + w + 1; ++i) {
		  for (var j = y-1; j < y + h + 1; ++j) {
				if (ret[i] && ret[i][j] === 0) { return false; }
		  }
		}
	  return true;
	}
	
	// helper function to random between min and max
	function randMinMax(min, max)
	{
	  return Math.ceil(Math.random() * (max - min)) + min;
	}
	
	// method to create a single random room
	function createRandomRoom()
	{
	  var x =  Math.floor(Math.random() * (mapSize.x - maxRoomSize - 2)) + 1;
	  var y = Math.floor(Math.random() * (mapSize.y - maxRoomSize - 2)) + 1;
	  var w = randMinMax(minRoomSize, maxRoomSize);
	  var h = randMinMax(minRoomSize, maxRoomSize);
	  return {x:x, y:y, w:w, h:h};
	}
	
	// create first room and set it in map. we'll use it as seed and build from there.
	var room = createRandomRoom();
	setFloor(room);
  
	// list with all rooms to return
	var allRooms = [];
  
	// list with all doors to return
	var allDoors = [];
	
	// grow recursively from the seed room until we have enough
	function growMap(lastRoom)
	{ 
	  // update all rooms list
	  allRooms.push(lastRoom); 
	  
	  // create empty neighbors list for this room
	  lastRoom.neighbors = [];
	  
	  // direction to create neighbor rooms in
	  // note: this method to shuffle arrays is not a good way and shouldn't be use for serious stuff - but its good enough for just 4 items like we have :)
	  var directions = ['up', 'down', 'left', 'right'].sort( () => .5 - Math.random() );
	  
	  // create neighbors in random order
	  for (var i = 0; i < directions.length; ++i) {
		
		// if ran out of rooms to generate, stop here
		if (roomsLeft <= 0) { return; }
		
		// build neighbor room
		switch (directions[i])
		{
		  // build up room
		  case "up":
			{
			  // make sure we have enough room up
			  if (lastRoom.y < minRoomSize + 2) { continue; }
			  
			  // create random width and x
				var width = randMinMax(minRoomSize, maxRoomSize);
			  var minX = Math.max(lastRoom.x - (width - 2), 1);
			  var maxX = Math.min(lastRoom.x + lastRoom.w - 2, mapSize.x - minRoomSize - 1);
			  var x = randMinMax(minX, maxX);
  
			  // create random height and set y based on it
			  var height = Math.min(randMinMax(minRoomSize, maxRoomSize), lastRoom.y - 2);
			  var y = lastRoom.y - height - 1;
			  
			  // create room and make sure its legal
			  var room = {x: x, y: y, w: width, h: height};
			  if (isValid(room)) 
			  {
				// set room + door
				lastRoom.neighbors.push(room);
				  setFloor(room);
				var doorX = randMinMax(Math.max(lastRoom.x + 1, x), Math.min(lastRoom.x + lastRoom.w - 2, x + width - 2));
				var doorY = lastRoom.y - 1;
				  ret[doorX][doorY] = 0;
				allDoors.push({x: doorX, y: doorY});
				
				  // expand recursively with the new room
				roomsLeft--;
				  growMap(room);
			  }
			}
  
		  // build down room
		  case "down":
			{
			  // make sure we have enough room down
			  if (lastRoom.y + lastRoom.h > mapSize.y - minRoomSize - 2) { continue; }
			  
			  // create random width and x
				var width = randMinMax(minRoomSize, maxRoomSize);
			  var minX = Math.max(lastRoom.x - (width - 2), 1);
			  var maxX = Math.min(lastRoom.x + lastRoom.w - 2, mapSize.x - minRoomSize - 1);
			  var x = randMinMax(minX, maxX);
  
			  // create random height and set y based on it
			  var height = Math.min(randMinMax(minRoomSize, maxRoomSize), mapSize.y - lastRoom.y - lastRoom.h - 2);
			  var y = lastRoom.y + lastRoom.h + 1;
			  
			  // create room and make sure its legal
			  var room = {x: x, y: y, w: width, h: height};
			  if (isValid(room)) 
			  {
				// set room + door
				lastRoom.neighbors.push(room);
				  setFloor(room);
				var doorX = randMinMax(Math.max(lastRoom.x + 1, x), Math.min(lastRoom.x + lastRoom.w - 2, x + width - 2));
				var doorY = y - 1;
				  ret[doorX][doorY] = 0;
				allDoors.push({x: doorX, y: doorY});
  
				  // expand recursively with the new room
				roomsLeft--;
				  growMap(room);
			  }
			}
  
		  // build left room
		  case "left":
			{
			  // make sure we have enough room left
			  if (lastRoom.x < minRoomSize + 2) { continue; }
			  
			  // create random height and y
				var height = randMinMax(minRoomSize, maxRoomSize);
			  var minY = Math.max(lastRoom.y - (height - 2), 1);
			  var maxY = Math.min(lastRoom.y + lastRoom.h - 2, mapSize.y - minRoomSize - 1);
			  var y = randMinMax(minY, maxY);
  
			  // create random width and set x based on it
			  var width = Math.min(randMinMax(minRoomSize, maxRoomSize), lastRoom.x - 2);
			  var x = lastRoom.x - width - 1;
			  
			  // create room and make sure its legal
			  var room = {x: x, y: y, w: width, h: height};
			  if (isValid(room)) 
			  {
				// set room + door
				lastRoom.neighbors.push(room);
				  setFloor(room);
				var doorY = randMinMax(Math.max(lastRoom.y + 1, y), Math.min(lastRoom.y + lastRoom.h - 2, y + height - 2));
				var doorX = lastRoom.x - 1;
				  ret[doorX][doorY] = 0;
				allDoors.push({x: doorX, y: doorY});
  
				  // expand recursively with the new room
				roomsLeft--;
				  growMap(room);
			  }
			}
  
		  // build right room
		  case "right":
			{
			  // make sure we have enough room right
			  if (lastRoom.x + lastRoom.w > mapSize.x - minRoomSize - 2) { continue; }
			  
			  // create random height and y
				var height = randMinMax(minRoomSize, maxRoomSize);
			  var minY = Math.max(lastRoom.y - (height - 2), 1);
			  var maxY = Math.min(lastRoom.y + lastRoom.h - 2, mapSize.y - minRoomSize - 1);
			  var y = randMinMax(minY, maxY);
  
			  // create random width and set x based on it
			  var width = Math.min(randMinMax(minRoomSize, maxRoomSize), mapSize.x - lastRoom.x - lastRoom.w - 2);
			  var x = lastRoom.x + lastRoom.w + 1;
			  
			  // create room and make sure its legal
			  var room = {x: x, y: y, w: width, h: height};
			  if (isValid(room)) 
			  {
				// set room + door
				lastRoom.neighbors.push(room);
				  setFloor(room);
				var doorY = randMinMax(Math.max(lastRoom.y + 1, y), Math.min(lastRoom.y + lastRoom.h - 2, y + height - 2));
				var doorX = x - 1;
				  ret[doorX][doorY] = 0;
				allDoors.push({x: doorX, y: doorY});
  
				  // expand recursively with the new room
				roomsLeft--;
				  growMap(room);
			  }
			}
		}
	  }
	  
	}
	
	// start building rooms
	growMap(room);
	
	// return grid
	return {tiles: ret, rooms: allRooms, doors: allDoors};
  }