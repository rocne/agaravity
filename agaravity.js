// constants
var WIDTH = 2000;
var HEIGHT = 1800;

var INITIAL_NUM_THINGS = 250;

// debugging vars
var lastFrameTime = 0;
var shouldLogFrameRate = false;
var fooCount = 0;

// sim variables
var th = Array();

function setup() {
	createCanvas(WIDTH, HEIGHT);
	for (var i = 0; i < INITIAL_NUM_THINGS; i++)
		th[i] = new thing();

	lastFrameTime = getTime();
	imageMode(CORNER);
}

function draw() {
	fooCount++;
	if (shouldLogFrameRate)
		logFrameRate();

	background(25);
	
	rect(10, 10, WIDTH -20, HEIGHT -20);

	handleInteractions();
	updateAndDisplayThings();	
}

function updateAndDisplayThings() {
	for (var i = 0; i < th.length; i++) {
		if (th[i].shouldBeDestroyed) {
			th.splice(i, 1);
		} else {
			th[i].update();
			th[i].show();
			var r = th[i].getRadius();
		}
	}
}

function handleInteractions() {
	for (var i = 0; i < th.length; i++) {
		for (var j = 0; j < th.length; j++) {
			if (i != j) {
				// handle interaction
				if (th[i].isCollidingWith(th[j])) {
					if (th[i].mass > th[j].mass)
						th[i].absorb(th[j]);

				}
			}
		}
	}
}

function logFrameRate() {
	var currTime = getTime();
	console.log("Time since last frame: " + currTime - lastFrameTime);
	console.log("Frame rate: " + 1000.0 / (currTime - lastFrameTime) + "\n\n");
	lastFrameTime = currTime;
}

function stopAtFrameCount(count) {
	fooCount++;
	if (fooCount > count)
		while(true)
			;
}

function getTime() {
	return new Date().getTime();
}
