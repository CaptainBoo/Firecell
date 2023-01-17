var UUIDButton = document.getElementById('submitUUID');
UUIDButton.addEventListener('click', returnUUID);
function returnUUID() {
	playerName = document.getElementById('inputPlayerName').value;
	fetch('https://api.mojang.com/users/profiles/minecraft/${playerName}', {mode:'no-cors'})
		.then((res) => res.json())
		.then(console.log);
}
