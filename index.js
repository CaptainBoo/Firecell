import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
const app = express();
const port = 3000;

app.use(express.static('dist'));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
