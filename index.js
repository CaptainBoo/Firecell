import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import 'dotenv/config';

import express from 'express'
const app = express()
const port = 3000
app.use(express.static("public"));
	
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})