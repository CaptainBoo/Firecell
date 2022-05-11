//Setting up the canvas
var canvas = document.getElementById("myCanvas");\
var ctx = canvas.getContext("2d");
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

ctx.beginPath();
ctx.arc(centerX, centerY, 20, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();