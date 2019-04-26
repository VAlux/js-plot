const gridSize = 50;
const tickLength = 3;
const tickTextOffset = 3;
const lastGridLineOffset = 0.5;
const tickTextMaxWidth = 15;

const font = "9px Arial";
const axisColor = "#ffffff";
const fontColor = "#ffffff"
const tickColor = "#ffffff";
const gridColor = "#f9f9f9";
const crosshairColor = "#f9f9f9";

const canvas = document.getElementById("plot-canvas");
const context = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const xAxisGridLinesAmount = Math.floor(canvasWidth / gridSize);
const yAxisGridLinesAmount = Math.floor(canvasHeight / gridSize);

const xAxisGridOrigin = xAxisGridLinesAmount / 2;
const yAxisGridOrigin = yAxisGridLinesAmount / 2;

var mousePosition = { x: 0, y: 0 };

function init() {
  context.lineCap = "round";
  translateCanvasOrigin();
  window.requestAnimationFrame(draw);
}

function translateCanvasOrigin() {
  context.translate(xAxisGridOrigin * gridSize, yAxisGridOrigin * gridSize);
}

function drawAxis(gridLinesAmount, axisOrigin, isHorizontal) {
  for (var i = -gridLinesAmount; i <= gridLinesAmount; i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = obtainStrokeStyle(0, i);

    const offset = obtainGridLineOffset(i, gridLinesAmount)

    if (isHorizontal) {
      const y = gridSize * i + offset;
      context.moveTo(-axisOrigin * gridSize, y);
      context.lineTo(canvasWidth, y);
    } else {
      const x = gridSize * i - offset;
      context.moveTo(x, -axisOrigin * gridSize);
      context.lineTo(x, canvasHeight);
    }

    context.stroke();
  }

  function obtainStrokeStyle(axisOrigin, currentIteration) {
    if (currentIteration === axisOrigin) {
      return axisColor;
    } else {
      return gridColor;
    }
  }

  function obtainGridLineOffset(iteration, linesAmount) {
    if (iteration === linesAmount) {
      return lastGridLineOffset; // last grid line should be offsetted.
    }
  
    return 0;
  }
}

function drawAxisTicks(axisOrigin, isHorizontal) {
  for (var i = -axisOrigin; i <= axisOrigin; i++) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = tickColor;
    context.font = font;
    context.fillStyle = fontColor;

    const scaledEndPoint = i * gridSize;
    if (isHorizontal) {
      context.moveTo(scaledEndPoint, -tickLength);
      context.lineTo(scaledEndPoint, tickLength);
      context.stroke();
  
      if (i !== 0) {
        context.textAlign = "start";
        context.fillText(i, scaledEndPoint, -tickTextOffset, tickTextMaxWidth);
      }
    } else {
      context.moveTo(-tickLength, scaledEndPoint);
      context.lineTo(tickLength, scaledEndPoint);
      context.stroke();
  
      if (i !== 0) {
        context.textAlign = "end";
        context.fillText(i, -tickTextOffset, scaledEndPoint, tickTextMaxWidth);
      }
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
var offset = 0.000005;
var increment = offset;

function drawFunctions(discretizationStep) {
  for (var x = -xAxisGridOrigin; x <= xAxisGridOrigin; x += discretizationStep) {
    for (var y = -yAxisGridOrigin; y <= yAxisGridOrigin; y += discretizationStep) {
      functionIteration((x, y) => 2 * Math.PI * (Math.sin(x * offset) * Math.cos(y * offset)), x, y, discretizationStep);
      offset += increment;
    }
  }

  function functionIteration(func, x, y, step) {
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = `#${(Math.PI * (x / y) + Math.sin(offset) / 50).toString(16).substring(2, 8)}`
    context.moveTo(x * gridSize, func(x, y) * gridSize);
    context.lineTo((x + step) * gridSize, func(x + step, y + step) * gridSize);
    context.stroke();
  }
}
// ========================================================================

function calculateMouseRelativePositionInCanvas(e) {
  mousePosition.x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - canvas.offsetLeft - xAxisGridOrigin * gridSize;
  mousePosition.y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - canvas.offsetTop - yAxisGridOrigin * gridSize;
}

function draw() {
  context.clearRect(-xAxisGridOrigin * gridSize, -yAxisGridOrigin * gridSize, canvasWidth, canvasHeight);

  drawAxis(yAxisGridLinesAmount, xAxisGridOrigin, true);
  drawAxis(xAxisGridLinesAmount, yAxisGridOrigin, false);
  drawAxisTicks(xAxisGridOrigin, true);
  drawAxisTicks(yAxisGridOrigin, false);
  drawFunctions(0.5);
  drawCrosshair();

  window.requestAnimationFrame(draw);
}

init();