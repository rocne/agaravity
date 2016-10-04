// constants
var WIDTH = 0;//2500;
var HEIGHT = 0;//1400;

var INITIAL_NUM_THINGS = 250;

// debugging vars
var lastFrameTime = 0;
var shouldLogFrameRate = false;
var fooCount = 0;

// sim variables
var th = Array();

window.onload = function() {
	HEIGHT = window.innerHeight * 0.95;
	WIDTH = window.innerWidth * 0.95;
}

function setup() {
	while (WIDTH == 0 || HEIGHT == 0)
		;

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
	
	fill(255);	
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
				th[i].accumulateForce(th[i].getGravitationalForce(th[j]));
				if (th[i].isCollidingWith(th[j])) {
					if (th[i].mass > th[j].mass)
						th[i].absorb(th[j]);
				}
			}
		}
	}
	for (var i = 0; i < th.length; i++)
		th[i].applyAccumulatedForce();
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
