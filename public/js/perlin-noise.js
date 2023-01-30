const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

var image = ctx.createImageData(canvas.width, canvas.height);
var data = image.data;

const perlinNoise = [];

noise.seed(15);
for (var x = 0; x < 10; x++) {
	for (var y = 0; y < 10; y++) {
		var output = Math.abs(noise.perlin2(x / 100, y / 100));
		r = g = b = Math.round(255 * output);
	}
}
ctx.putImageData(image, 0, 0);
