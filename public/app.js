var UUIDButton = document.getElementById('submitUUID');
UUIDButton.addEventListener('click', returnUUID);
var UUIDResponse
function returnUUID() {
	playerName = document.getElementById('inputPlayerName').value;
	fetch(`https://api.ashcon.app/mojang/v2/user/${playerName}`)
		.then((response) => response.json())
		.then((data) => document.getElementById('returnUUID').innerText = data.uuid)
		.catch((error) => {
			console.log(error);
		});
}