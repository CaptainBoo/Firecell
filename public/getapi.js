var UUIDButton = document.getElementById('submitUUID');
UUIDButton.addEventListener('click', returnUUID);
function returnUUID() {
	playerName = document.getElementById('inputPlayerName').value;
	fetch('https://api.mojang.com/users/profiles/minecraft/${playerName}')
		.then((response) => response.json())
		.then((json) => console.log(json));
}
