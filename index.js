import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public/'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + 'index.html');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
