const N = 7;
const RANDOM_INITIAL_RANGE = 40;
const MATRIX_LENGTH = Math.pow(2, N) + 1;
const CANVAS_HEIGHT = MATRIX_LENGTH * 2;
const CANVAS_WIDTH = MATRIX_LENGTH * 2;
const MATRIX_DIMENSIONS = {
	pixelHeight: CANVAS_HEIGHT / MATRIX_LENGTH,
	pixelWidth: CANVAS_WIDTH / MATRIX_LENGTH,
};
const COLORS = [
	{
		terrainType: 'mountains',
		hue: 30,
		saturation: 50,
		lightness: 25,
		variance: 20,
	},
	{
		terrainType: 'plains',
		hue: 100,
		saturation: 50,
		lightness: 30,
		variance: 20,
	},
	{
		terrainType: 'water',
		hue: 200,
		saturation: 90,
		lightness: 25,
		variance: 10,
	},
];
const canvas = document.getElementById('dsa-canvas');
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

function getColor(percentage) {
	return landscapeColors(percentage);
}

function landscapeColors(percentage) {
	const colorVariety = COLORS.length;
	const colorStep = 360 / colorVariety;
	const colorIndex = Math.floor(percentage * colorVariety);
	const { terrainType, hue, saturation, lightness, variance } =
		COLORS[colorIndex] || COLORS[COLORS.length - 1];
	return {
		hsl: `hsl(${
			hue < 360 ? hue : hue - 360
		}, ${saturation}%, ${lightness}%)`,
		terrainType,
	};
}

function draw(terrain_matrix) {
	const ctx = canvas.getContext('2d');
	const paths = {
		water: new Path2D(),
		plains: new Path2D(),
		mountains: new Path2D(),
	};
	ctx.clearRect(0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
	ctx.beginPath();
	terrain_matrix.forEach((pixelsRow, rowIndex) => {
		const y = rowIndex * MATRIX_DIMENSIONS.pixelHeight;
		pixelsRow.forEach((pixel, pixelIndex) => {
			const x = pixelIndex * MATRIX_DIMENSIONS.pixelWidth;
			const { hsl, terrainType } = getColor(pixel);
			ctx.fillStyle = hsl;
			ctx.fillRect(
				x,
				y,
				MATRIX_DIMENSIONS.pixelWidth,
				MATRIX_DIMENSIONS.pixelHeight
			);
			const tmpPath = new Path2D();
			tmpPath.rect(
				x,
				y,
				MATRIX_DIMENSIONS.pixelWidth,
				MATRIX_DIMENSIONS.pixelHeight
			);
			paths[terrainType].addPath(tmpPath);
		});
	});
	ctx.closePath();
	return paths;
}

function randomInRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateMatrix() {
	const matrix = new Array(MATRIX_LENGTH)
		.fill(0)
		.map(() => new Array(MATRIX_LENGTH).fill(null));

	matrix[0][MATRIX_LENGTH - 1] = randomInRange(0, RANDOM_INITIAL_RANGE);
	matrix[MATRIX_LENGTH - 1][0] = randomInRange(0, RANDOM_INITIAL_RANGE);
	matrix[0][0] = randomInRange(0, RANDOM_INITIAL_RANGE);
	matrix[MATRIX_LENGTH - 1][MATRIX_LENGTH - 1] = randomInRange(
		0,
		RANDOM_INITIAL_RANGE
	);

	return matrix;
}

function calculateSquare(matrix, chunkSize, randomFactor) {
	let sumComponents = 0;
	let sum = 0;
	for (let i = 0; i < matrix.length - 1; i += chunkSize) {
		for (let j = 0; j < matrix.length - 1; j += chunkSize) {
			const BOTTOM_RIGHT = matrix[j + chunkSize]
				? matrix[j + chunkSize][i + chunkSize]
				: null;
			const BOTTOM_LEFT = matrix[j + chunkSize]
				? matrix[j + chunkSize][i]
				: null;
			const TOP_LEFT = matrix[j][i];
			const TOP_RIGHT = matrix[j][i + chunkSize];
			const { count, sum } = [
				BOTTOM_RIGHT,
				BOTTOM_LEFT,
				TOP_LEFT,
				TOP_RIGHT,
			].reduce(
				(result, value) => {
					if (isFinite(value) && value != null) {
						result.sum += value;
						result.count += 1;
					}
					return result;
				},
				{ sum: 0, count: 0 }
			);
			matrix[j + chunkSize / 2][i + chunkSize / 2] =
				sum / count + randomInRange(-randomFactor, randomFactor);
		}
	}
}

function calculateDiamond(matrix, chunkSize, randomFactor) {
	const half = chunkSize / 2;
	for (let y = 0; y < matrix.length; y += half) {
		for (
			let x = (y + half) % chunkSize;
			x < matrix.length;
			x += chunkSize
		) {
			const BOTTOM = matrix[y + half] ? matrix[y + half][x] : null;
			const LEFT = matrix[y][x - half];
			const TOP = matrix[y - half] ? matrix[y - half][x] : null;
			const RIGHT = matrix[y][x + half];
			const { count, sum } = [BOTTOM, LEFT, TOP, RIGHT].reduce(
				(result, value) => {
					if (isFinite(value) && value != null) {
						result.sum += value;
						result.count += 1;
					}
					return result;
				},
				{ sum: 0, count: 0 }
			);
			matrix[y][x] =
				sum / count + randomInRange(-randomFactor, randomFactor);
		}
	}
	return matrix;
}

function diamondSquare(matrix) {
	let chunkSize = MATRIX_LENGTH - 1;
	let randomFactor = RANDOM_INITIAL_RANGE;

	while (chunkSize > 1) {
		calculateSquare(matrix, chunkSize, randomFactor);
		calculateDiamond(matrix, chunkSize, randomFactor);
		chunkSize /= 2;
		randomFactor /= 2;
	}

	return matrix;
}

function normalizeMatrix(matrix) {
	const maxValue = matrix.reduce((max, row) => {
		return row.reduce((max, value) => Math.max(value, max));
	}, -Infinity);

	return matrix.map((row) => {
		return row.map((val) => val / maxValue);
	});
}

function copyMatrix(matrix) {
	return JSON.parse(JSON.stringify(matrix));
}

function start() {
	console.log('Start');
	const matrix = diamondSquare(generateMatrix());
	const normalizedMatrix = normalizeMatrix(matrix);
	console.log('Finish');
	paths = draw(normalizedMatrix);
}
let paths;
start();

document.querySelector('button').addEventListener('click', start);
canvas.addEventListener('click', (event) => {
	const pathsNames = Object.keys(paths);
	const ctx = canvas.getContext('2d');
	const { top, left } = canvas.getBoundingClientRect();
	for (let i = 0; i < pathsNames.length; i++) {
		if (
			ctx.isPointInPath(
				paths[pathsNames[i]],
				event.clientX - left,
				event.clientY - top
			)
		) {
			alert(`I've just hit the ${pathsNames[i]}`);
			return;
		}
	}
	console.log('Missed something?');
});
