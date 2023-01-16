import fetch from 'node-fetch';

var playerName;
function returnText() {
	playerName = document.getElementById('inputPlayerName').value;
	document.getElementById('playerName').innerText = playerName;
}

fetch('https://api.mojang.com/users/profiles/minecraft/Captain_Boo')
  .then(res => res.json())
  .then(console.log)