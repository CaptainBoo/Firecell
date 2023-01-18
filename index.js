import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import 'dotenv/config';

import express from 'express';
const app = express();


const port = 3000;

app.use(function( req, res, next ) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-requested-with, content-type");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
});

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
function newFunction() {
	return require('cors');
}

