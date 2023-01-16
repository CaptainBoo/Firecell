import fetch from 'node-fetch';
function returnUUID() {
	playerName = document.getElementById('inputPlayerName').value;
	fetch('https://api.mojang.com/users/profiles/minecraft/${playerName}')
		.then((res) => res.json())
		.then(console.log);
}
