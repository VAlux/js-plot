var gridSize = 50
var tickLength = 3;
var tickTextOffset = 3
var tickTextMaxWidth = 15

var font = '9px Arial'
var axisColor = "#000000"
var tickColor = "#000000"
var gridColor = "#e9e9e9"

var canvas = document.getElementById("plot-canvas")
var context = canvas.getContext('2d')
var canvasWidth = canvas.width
var canvasHeight = canvas.height

var xAxisGridLinesAmount = Math.floor(canvasHeight / gridSize)
var yAxisGridLinesAmount = Math.floor(canvasWidth / gridSize)

var xAxisGridOffset = yAxisGridLinesAmount / 2;
var yAxisGridOffset = xAxisGridLinesAmount / 2;

function initContext() {
  context.lineCap = "round"
}

function translateCanvasOrigin() {
  context.translate(yAxisGridOffset * gridSize, xAxisGridOffset * gridSize);
}

function obtainStrokeStyle(axisOrigin, currentIteration) {
  if (currentIteration === axisOrigin) {
    return axisColor
  } else {
    return gridColor
  }
}

function drawXAxis() {
  for (var i = -xAxisGridLinesAmount; i <= xAxisGridLinesAmount; i++) {
    context.beginPath()
    context.lineWidth = 1

    context.strokeStyle = obtainStrokeStyle(0, i)

    if (i === xAxisGridLinesAmount) {
      const y = gridSize * i + 0.5
      context.moveTo(-xAxisGridOffset * gridSize, y)
      context.lineTo(canvasWidth, y)
    } else {
      const y = gridSize * i
      context.moveTo(-xAxisGridOffset * gridSize, y)
      context.lineTo(canvasWidth, y)
    }

    context.stroke();
  }
}

function drawYAxis() {
  for (var i = -yAxisGridLinesAmount; i <= yAxisGridLinesAmount; i++) {
    context.beginPath()
    context.lineWidth = 1

    context.strokeStyle = obtainStrokeStyle(0, i)

    if (i === yAxisGridLinesAmount) {
      const x = gridSize * i - 0.5
      context.moveTo(x, -yAxisGridOffset * gridSize)
      context.lineTo(x, canvasHeight)
    } else {
      const x = gridSize * i
      context.moveTo(x, -yAxisGridOffset * gridSize)
      context.lineTo(x, canvasHeight)
    }

    context.stroke();
  }
}

function drawXAxisTicks() {
  for (var i = -xAxisGridOffset; i <= xAxisGridOffset; i++) {
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = tickColor

    var x = i * gridSize
    context.moveTo(x, -tickLength)
    context.lineTo(x, tickLength)
    context.stroke()

    if (i !== 0) {
      context.font = font
      context.textAlign = 'start'
      context.fillText(i, x, -tickTextOffset, tickTextMaxWidth)
    }
  }
}

function drawYAxisTicks() {
  for (var i = -yAxisGridOffset; i <= yAxisGridOffset; i++) {
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = tickColor

    var y = i * gridSize
    context.moveTo(-tickLength, y)
    context.lineTo(tickLength, y)
    context.stroke()

    if (i !== 0) {
      context.font = font
      context.textAlign = 'end'
      context.fillText(i, -tickTextOffset, y, tickTextMaxWidth)
    }
  }
}

function drawFunctions(discretizationStep) {
  for (var x = -xAxisGridOffset; x <= xAxisGridOffset; x += discretizationStep) {
    functionIteration((arg) => Math.sin(arg), x, discretizationStep)
    functionIteration((arg) => Math.cos(arg), x, discretizationStep)
    functionIteration((arg) => Math.tan(arg), x, discretizationStep)
    functionIteration((arg) => Math.atan(arg), x, discretizationStep)
  }
}

function functionIteration(func, x, step) {
  context.beginPath()
  context.lineWidth = 2
  context.moveTo(x * gridSize, func(x) * gridSize)
  context.lineTo((x + step) * gridSize, func(x + step) * gridSize)
  context.stroke()
}

initContext()
translateCanvasOrigin()
drawXAxis()
drawYAxis()
drawXAxisTicks()
drawYAxisTicks()
drawFunctions(0.1)