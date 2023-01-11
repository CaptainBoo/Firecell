import fetch from 'node-fetch';

fetch(
	'https://api.hypixel.net/player?key=09479543-83cb-4ce9-aba1-1e38e8bb7609&name=Captain_Boo'
)
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
	})
	.catch((error) => console.log('Network Error', error));
