var gridSize = 50;
var tickLength = 3;
var tickTextOffset = 3;
var tickTextMaxWidth = 15;

var font = "9px Arial";
var axisColor = "#000000";
var tickColor = "#000000";
var gridColor = "#e9e9e9";
var crosshairColor = "#e5e5e5";

var canvas = document.getElementById("plot-canvas");
var context = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var xAxisGridLinesAmount = Math.floor(canvasWidth / gridSize);
var yAxisGridLinesAmount = Math.floor(canvasHeight / gridSize);

var xAxisGridOrigin = xAxisGridLinesAmount / 2;
var yAxisGridOrigin = yAxisGridLinesAmount / 2;

var mousePosition = { x: 0, y: 0 };

function init() {
  context.lineCap = "round";
  translateCanvasOrigin();
  window.requestAnimationFrame(draw);
}

function translateCanvasOrigin() {
  context.translate(xAxisGridOrigin * gridSize, yAxisGridOrigin * gridSize);
}

function obtainStrokeStyle(axisOrigin, currentIteration) {
  if (currentIteration === axisOrigin) {
    return axisColor;
  } else {
    return gridColor;
  }
}

function drawXAxis() {
  for (var i = -xAxisGridLinesAmount; i <= xAxisGridLinesAmount; i++) {
    context.beginPath();
    context.lineWidth = 1;

    context.strokeStyle = obtainStrokeStyle(0, i);

    if (i === xAxisGridLinesAmount) {
      const y = gridSize * i + 0.5;
      context.moveTo(-xAxisGridOrigin * gridSize, y);
      context.lineTo(canvasWidth, y);
    } else {
      const y = gridSize * i;
      context.moveTo(-xAxisGridOrigin * gridSize, y);
      context.lineTo(canvasWidth, y);
    }

    context.stroke();
  }
}

function drawYAxis() {
  for (var i = -yAxisGridLinesAmount; i <= yAxisGridLinesAmount; i++) {
    context.beginPath();
    context.lineWidth = 1;

    context.strokeStyle = obtainStrokeStyle(0, i);

    if (i === yAxisGridLinesAmount) {
      const x = gridSize * i - 0.5;
      context.moveTo(x, -yAxisGridOrigin * gridSize);
      context.lineTo(x, canvasHeight);
    } else {
      const x = gridSize * i;
      context.moveTo(x, -yAxisGridOrigin * gridSize);
      context.lineTo(x, canvasHeight);
    }

    context.stroke();
  }
}

function drawXAxisTicks() {
  for (var i = -xAxisGridOrigin; i <= xAxisGridOrigin; i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = tickColor;

    var x = i * gridSize;
    context.moveTo(x, -tickLength);
    context.lineTo(x, tickLength);
    context.stroke();

    if (i !== 0) {
      context.font = font;
      context.textAlign = "start";
      context.fillText(i, x, -tickTextOffset, tickTextMaxWidth);
    }
  }
}

function drawYAxisTicks() {
  for (var i = -yAxisGridOrigin; i <= yAxisGridOrigin; i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = tickColor;

    var y = i * gridSize;
    context.moveTo(-tickLength, y);
    context.lineTo(tickLength, y);
    context.stroke();

    if (i !== 0) {
      context.font = font;
      context.textAlign = "end";
      context.fillText(i, -tickTextOffset, y, tickTextMaxWidth);
    }
  }
}

function drawCrosshair() {
  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = crosshairColor;
  context.moveTo(-xAxisGridOrigin * gridSize, mousePosition.y);
  context.lineTo(xAxisGridOrigin * gridSize, mousePosition.y);
  context.stroke();
  context.moveTo(mousePosition.x, -yAxisGridOrigin * gridSize);
  context.lineTo(mousePosition.x, yAxisGridOrigin * gridSize);
  context.stroke();
  context.font = font;
  context.textAlign = "end";
  context.fillText(`x ${mousePosition.x} y ${mousePosition.y}`, mousePosition.x, mousePosition.y);
}

// ========================================================================
// TODO: this is just for testing. should be deleted!
var offset = 0.00005;
var increment = offset;

function drawFunctions(discretizationStep) {
  for (var x = -xAxisGridOrigin;x <= xAxisGridOrigin; x += discretizationStep) {
    functionIteration(arg => Math.sin(arg * offset), x, discretizationStep);
    functionIteration(arg => Math.cos(arg * offset), x, discretizationStep);
    functionIteration(arg => Math.tan(arg * offset), x, discretizationStep);
    functionIteration(arg => Math.atan(arg * offset), x, discretizationStep);
    offset += increment;
  }

  function functionIteration(func, x, step) {
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(x * gridSize, func(x) * gridSize);
    context.lineTo((x + step) * gridSize, func(x + step) * gridSize);
    context.stroke();
  }
}
// ========================================================================

function calculateMouseRelativePositionInCanvas(e) {
  mousePosition.x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - canvas.offsetLeft - xAxisGridOrigin * gridSize;
  mousePosition.y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - canvas.offsetTop - yAxisGridOrigin * gridSize;
  console.log("mouse position: " + JSON.stringify(mousePosition));
}

function draw() {
  context.clearRect(-xAxisGridOrigin * gridSize, -yAxisGridOrigin * gridSize, canvasWidth, canvasHeight);

  drawXAxis();
  drawYAxis();
  drawXAxisTicks();
  drawYAxisTicks();
  drawFunctions(0.1);
  drawCrosshair();

  window.requestAnimationFrame(draw);
}

init();
