var mouse = {
	x:0,
	y:0,
	click:false
}

var Box = function(x, y) {
	this.x = x;
	this.y = y;
}

var BOX_DIM = 10;
var WIDTH = 400;
var HEIGHT = 400;
var ACTIVEBOXCOLOR = "rgb(0,200,0)"
var canvas;
var boxIsAlive = new Array();
var gameIsRunning = false;

if(WIDTH % BOX_DIM != 0) {
	throw "Error: WIDTH isn't dividable with BOX_DIM!"
}
if(HEIGHT % BOX_DIM != 0) {
	throw "Error: HEIGHT isn't dividable with BOX_DIM!"
}

// Toggle Edit/Game mode
var toggleGame = function() {
	if (gameIsRunning) {
		gameIsRunning = false;
		document.getElementById("startEdit").value = "Start";
	} else {
		gameIsRunning = true;
		document.getElementById("startEdit").value = "Edit";
	}
}

// Reset all boxes (kills them)
var resetBoxes = function() {
	for(var i = 0; i < WIDTH/BOX_DIM; i++) {
		boxIsAlive[i] = new Array();
		for(var k = 0; k < HEIGHT/BOX_DIM; k++) {
			boxIsAlive[i][k] = false;
		}
	}
	if(gameIsRunning) {
		toggleGame();
	}
}

// Main function, inits and starts game loop
var main = function () {
	canvas = document.getElementById('gameoflife');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	if (canvas.getContext) {
		context = canvas.getContext('2d');
	}
	resetBoxes();
	setInterval(loop, 100);
}

// Gameloop
var loop = function () {
	if (gameIsRunning) {
		updateGame();
	} else {
		updateDraw();
	}
	context.clearRect(0,0,WIDTH,HEIGHT);
	drawGrid();
	drawBoxes();
}

// Updates canvas (during edit)
var updateDraw = function() {
	if(mouse.click) {
		if (boxIsAlive[mouse.x][mouse.y]) {
			boxIsAlive[mouse.x][mouse.y] = false;
		} else {
			boxIsAlive[mouse.x][mouse.y] = true;
		}
	}
}

// Draws the background grid
var drawGrid = function () {
	context.beginPath();

    for (var x = 0; x <= WIDTH; x += BOX_DIM) {
	    context.moveTo(x, 0);
		context.lineTo(x, HEIGHT);
    }
    for (var x = 0; x <= HEIGHT; x += BOX_DIM) {
        context.moveTo(0, x);
        context.lineTo(WIDTH, x);
    }

    context.closePath();
    context.strokeStyle = "black";
    context.stroke();
}

// Draws the living boxes
var drawBoxes = function() {
	for(var y = 0; y < HEIGHT/BOX_DIM; y++) {
		for(var x = 0; x < WIDTH/BOX_DIM; x++) {
			if(boxIsAlive[x][y]) {
				context.fillStyle = ACTIVEBOXCOLOR;
				context.fillRect(x*BOX_DIM, y*BOX_DIM, BOX_DIM, BOX_DIM);
			}
		}
	}
}

// Updates the game (during game mode)
var updateGame = function() {
	var boxesDying = new Array();
	var boxesBorn = new Array();
	for(var x = 0; x < WIDTH/BOX_DIM; x++) {
		for(var y = 0; y < HEIGHT/BOX_DIM; y++) {
			var numberOfNeighbours = countAliveNeighbours(new Box(x,y));
			if(boxIsAlive[x][y]) {
				if(numberOfNeighbours < 2 || numberOfNeighbours > 3) {
					boxesDying.push(new Box(x,y));
				}
			} else {
				if(numberOfNeighbours == 3) {
					boxesBorn.push(new Box(x,y))
				}
			}
		}
	}
	killBoxes(boxesDying);
	createBoxes(boxesBorn);
}

// Counts how many neighbours are alive to the box
var countAliveNeighbours = function(box) {
	var neighbours = 0;
	var i = box.x;
	var j = box.y;
	var rowLimit = (WIDTH/BOX_DIM)-1;
	var columnLimit = (HEIGHT/BOX_DIM)-1;

	for(var x = Math.max(0, i-1); x <= Math.min(i+1, rowLimit); x++) {
		for(var y = Math.max(0, j-1); y <= Math.min(j+1, columnLimit); y++) {
		    if((x !== i || y !== j) && boxIsAlive[x][y]) {
		    	neighbours++;
			}
		}
	}
	return neighbours;
}

// Kills all boxes in the list of boxes
var killBoxes = function(boxes) {
	for(var i = 0; i < boxes.length; i++) {
		boxIsAlive[boxes[i].x][boxes[i].y] = false;
	}
}

// Creates all boxes in the list of boxes
var createBoxes = function(boxes) {
	for(var i = 0; i < boxes.length; i++) {
		boxIsAlive[boxes[i].x][boxes[i].y] = true;
	}
}

// Event handlers
var mouseDown = function(event) {
	mouse.click = true;
}

var mouseUp = function(event) {
	mouse.click = false;
}

var mouseMove = function(event) {
	mouse.x = parseInt((event.pageX - canvas.offsetLeft)/BOX_DIM);
	if(mouse.x > (WIDTH/BOX_DIM)-1) {
		mouse.x = (WIDTH/BOX_DIM)-1;
	}
	mouse.y = parseInt((event.pageY - canvas.offsetTop)/BOX_DIM);
	if(mouse.y > (HEIGHT/BOX_DIM)-1) {
		mouse.y = (HEIGHT/BOX_DIM)-1;
	}
}