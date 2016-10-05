// View values
var WIDTH = 0;
var HEIGHT = 0;
var SCALE = 1.0;


// Reset values
var INITIAL_NUM_THINGS = 250;

var RANDOM_MASS_CENTER = 2275;
var RANDOM_MASS_RADIUS = 100;

var RANDOM_VEL_CENTER = 0;
var RANDOM_VEL_RADIUS = 25;

// debugging vars
var lastFrameTime = 0;
var shouldLogFrameRate = false;
var fooCount = 0;

// sim variables
var th = Array();

// inputs and input state values
var inputs = {};

var stopped = false;
var bounceEnabled = true;
var trackLargestThingEnabled = false;

function getZoomedWidth() {
	return WIDTH / SCALE;
}

function getZoomedHeight() {
	return HEIGHT / SCALE;
}

function resetInputChange_cb() {
	setWindowDimensions();
	th = [];
	createThings(INITIAL_NUM_THINGS);		
	resizeCanvas(WIDTH, HEIGHT);	
}

function createButtonInput(container, name, clickedFunction) {
	var input = document.createElement("BUTTON");
	input.setAttribute("name", name);
	input.onclick = clickedFunction;
	input.innerHTML = name;
	inputs[name] = input;
	container.appendChild(input);
}

function createCheckboxInput(container, name, defaultValue, changeFunction) {
	var label = createLabel(name);

	var input = document.createElement("INPUT");
	input.setAttribute("type", "checkbox");
	input.checked = defaultValue;
	input.onchange = changeFunction;

	label.appendChild(input);
	label.appendChild(document.createElement("BR"));

	container.appendChild(label);
	appendBR(container);
}

function mousePressed() {
	if (mouseButton == RIGHT) {
		rightClick();
	} else if (mouseButton == LEFT) {
		leftClick();
	} else if (mouseButton == CENTER) {
		centerClick();
	}
}

function leftClick() {
	var clicked = -1;
	var mouseVect = createVector(mouseX / SCALE, mouseY / SCALE);

	for (var i = 0; i < this.th.length; i++) {
		var d = mouseVect.dist(th[i].pos);
		var r = th[i].getRadius();
		if (d < r) {
			// clicked on the thing
			if (clicked == -1) {
				clicked = i;
			} else if (th[i].mass > th[clicked].mass) {
				clicked = i;
			}
		}
	}

	if (clicked != -1) {
		th[clicked].toggleLocked();
	}
}

function rightClick() {
	// TODO: implement ability to shoot things by clicking and dragging
	console.log("rightClick hasn't been implemented");
}

function centerClick() {
	// TODO: implement ability to use scroll wheel to change size of 
	//	 the things that you shoot with left click. Might not belong
	//	 in centerClick. Maybe there is another scroll event.
	console.log("centerClick hasn't been implemented");
}

function createLabel(name) {
	var label = document.createElement("LABEL");
	label.setAttribute("for", name);
	var span = document.createElement("SPAN");
	span.setAttribute("class", "input_label");
	span.innerHTML = name;
	label.appendChild(span);
	appendBR(label);
	return label;
}

function createRangeInput(container, name, min, max, defaultValue, step, changeFunction) {	
	var input = document.createElement("INPUT");
	input.setAttribute("name", name);
	input.setAttribute("type", "range");
	input.setAttribute("min", min);
	input.setAttribute("max", max);
	input.setAttribute("step", step);
	input.setAttribute("defaultValue", defaultValue);
	input.value = defaultValue;
	input.onchange = changeFunction;
	input.style.width = Math.floor(0.9 * WIDTH) + "px";
	inputs[name] = input;
	
	var label = createLabel(name);

	var readOut = document.createElement("SPAN");
	readOut.innerHTML = defaultValue;
	input.readOut = readOut;
	
	label.appendChild(input);
	label.appendChild(readOut);
	container.appendChild(label);
	appendBR(container);
}

function setWindowDimensions() {
	HEIGHT = window.innerHeight * 0.95;
	WIDTH = window.innerWidth * 0.95;

	if (WIDTH == 0 || HEIGHT == 0)
		WIDTH = HEIGHT = 1080;
}

function startStopInputChange_cb() {
	stopped = ! stopped;
}

function gravInputChange_cb() {
	var value = inputs["grav"].value;
	GRAV = value;	
	inputs["grav"].readOut.innerHTML = value;
}

function enableBounceInputChange_cb() {
	bounceEnabled = !bounceEnabled;
}

function showHistoryChange_cb() {
	SHOW_HISTORY = !SHOW_HISTORY;
}

function zoomInputChange_cb() {
	SCALE = this.value;
	this.readOut.innerHTML = this.value;
}

function numThingsInputChange_cb() {
	INITIAL_NUM_THINGS = this.value;
	this.readOut.innerHTML = this.value;
}

function trackLargestThingInputChange_cb() {
	// TODO: when tracking is enabled, apply forcer with arrow keys
	//	 maybe scroll wheel to change strength
	trackLargestThingEnabled = ! trackLargestThingEnabled

	console.log(trackLargestThingEnabled);
}

function historyLengthChange_cb() {
	HISTORY_LENGTH = this.value;
	this.readOut.innerHTML = this.value;
}

function randomMassCenterInputChange_cb() {
	console.log("Random mass center changed to " + this.value);
	RANDOM_MASS_CENTER = this.value;
	this.readOut.innerHTML = this.value;
}

function randomMassRadiusInputChange_cb() {
	console.log("Random mass radius changed to " + this.value);
	RANDOM_MASS_RADIUS = this.value;
	this.readOut.innerHTML = this.value;
}

function randomVelCenterInputChange_cb() {
	console.log("Random vel center changed to " + this.value);
	RANDOM_VEL_CENTER = this.value;
	this.readOut.innerHTML = this.value;
}

function randomVelRadiusInputChange_cb() {
	console.log("Random vel radius changed to " + this.value);
	RANDOM_VEL_RADIUS = this.value;
	this.readOut.innerHTML = this.value;
}

function createInputs() {
	var inputContainer = document.createElement("DIV");

	//					 container,		 name					min 	max		default 			step 	callback
	createRangeInput	(inputContainer, "random mass center", 	1, 		5000, 	RANDOM_MASS_CENTER, 1, 		randomMassCenterInputChange_cb); 
	createRangeInput	(inputContainer, "random mass radius",	1, 		500, 	RANDOM_MASS_RADIUS, 1, 		randomMassRadiusInputChange_cb);
	createRangeInput	(inputContainer, "random vel center", 	0, 		100, 	RANDOM_VEL_CENTER, 	1, 		randomVelCenterInputChange_cb);
	createRangeInput	(inputContainer, "random vel radius", 	0, 		100, 	RANDOM_VEL_RADIUS, 	1, 		randomVelRadiusInputChange_cb);
	createRangeInput	(inputContainer, "grav", 				0, 		0.25, 	GRAV, 				0.005, 	gravInputChange_cb);
	createRangeInput	(inputContainer, "history length", 		0, 		100, 	HISTORY_LENGTH, 	1, 		historyLengthChange_cb);
	createRangeInput	(inputContainer, "zoom", 				0.05, 	2.5, 	1.0, 				0.01, 	zoomInputChange_cb);
	createRangeInput	(inputContainer, "num things", 			1, 		1500, 	INITIAL_NUM_THINGS, 1, 		numThingsInputChange_cb);

	createCheckboxInput	(inputContainer, "enable bounce", 		bounceEnabled, enableBounceInputChange_cb);
	createCheckboxInput	(inputContainer, "track largest thing", trackLargestThingEnabled, trackLargestThingInputChange_cb);
	createCheckboxInput	(inputContainer, "enable show history", SHOW_HISTORY, showHistoryChange_cb);	
	
	createButtonInput	(inputContainer, "start/stop", startStopInputChange_cb);
	createButtonInput	(inputContainer, "reset", resetInputChange_cb);

	document.body.appendChild(inputContainer);

}

function appendBR(element) {
	element.appendChild(document.createElement("BR"));
}

function setup() {
	setWindowDimensions();
	createInputs();	

	createCanvas(WIDTH, HEIGHT);
	createThings(INITIAL_NUM_THINGS);

	lastFrameTime = getTime();
	imageMode(CORNER);
}

function createThings(numberOfThings) {
	for (var i = 0; i < numberOfThings; i++)
		th.push(new thing(randomMass(), randomPosition(), randomVelocity()));
}

function randomMass() {
	return RANDOM_MASS_CENTER + (2 * RANDOM_MASS_RADIUS * Math.random()) - RANDOM_MASS_RADIUS;
}

function randomVelocity() {
	return createVector(RANDOM_VEL_CENTER + (2 * RANDOM_VEL_RADIUS * Math.random()) - RANDOM_VEL_RADIUS,
			    RANDOM_VEL_CENTER + (2 * RANDOM_VEL_RADIUS * Math.random()) - RANDOM_VEL_RADIUS);
}

function randomPosition() {
	return createVector(Math.random() * getZoomedWidth(), Math.random() * getZoomedHeight());
}

function draw() {
	fooCount++;
	
	if (shouldLogFrameRate)
		logFrameRate();

	background(25);

	fill(255);	
	rect(10, 10, WIDTH -20, HEIGHT -20);

	if (!stopped) {
		handleInteractions();
		updateThings();
	}

	push();
	scale(SCALE, SCALE);
	if (trackLargestThingEnabled) {
		var largestThing = th[getLargestThingIndex()];
		translate(getZoomedWidth() / 2 - largestThing.pos.x, getZoomedHeight() / 2 - largestThing.pos.y);
	}


	displayThings();
	pop();

}

function getLargestThingIndex() {
	var largestThingIndex = 0;
	for (var i = 0; i < this.th.length; i++) {
		if (th[i].mass > th[largestThingIndex].mass)
			largestThingIndex = i;
	}
	return largestThingIndex;
}

function updateThings() {
	for (var i = 0; i < th.length; i++) {
		if (th[i].shouldBeDestroyed) {
			th.splice(i, 1);
		} else {
			th[i].update();
		}
	}
}

function displayThings() {
	for (var i = 0; i < th.length; i++)
			th[i].show();
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

function getTime() {
	return new Date().getTime();
}
