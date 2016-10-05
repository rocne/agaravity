// constants
var WIDTH = 0;//2500;
var HEIGHT = 0;//1400;

var SCALE = 1.0;

var INITIAL_NUM_THINGS = 250;

// debugging vars
var lastFrameTime = 0;
var shouldLogFrameRate = false;
var fooCount = 0;

// sim variables
var th = Array();

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

function resetClicked() {
	setWindowDimensions();
	th = [];
	createThings(INITIAL_NUM_THINGS);		
	resizeCanvas(WIDTH, HEIGHT);	
}

function createButtonInput(name, clickedFunction) {
	var input = document.createElement("BUTTON");
	input.setAttribute("name", name);
	input.onclick = clickedFunction;
	input.innerHTML = name;
	inputs[name] = input;
	return input;
}

function createCheckboxInput(name, defaultValue, changeFunction) {
	var label = createLabel(name);

	var input = document.createElement("INPUT");
	input.setAttribute("type", "checkbox");
	input.checked = defaultValue;
	input.onchange = changeFunction;

	label.appendChild(input);
	label.appendChild(document.createElement("BR"));

	return label;
}

function mousePressed() {
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

function createRangeInput(name, min, max, defaultValue, step, changeFunction) {	
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
	console.log(input.style.width);
	inputs[name] = input;
	
	var label = createLabel(name);

	var readOut = document.createElement("SPAN");
	readOut.innerHTML = defaultValue;
	input.readOut = readOut;
	
	label.appendChild(input);
	label.appendChild(readOut);
	appendBR(label);
	return label;
}

function startStopClicked() {
	stopped = ! stopped;
}

function updateGrav() {
	console.log(inputs);
	var value = inputs["grav"].value;
	GRAV = value;	
	inputs["grav"].readOut.innerHTML = value;
}

function setWindowDimensions() {
	HEIGHT = window.innerHeight * 0.95;
	WIDTH = window.innerWidth * 0.95;

	if (WIDTH == 0 || HEIGHT == 0)
		WIDTH = HEIGHT = 1080;
}

function enableBounceChanged() {
	bounceEnabled = !bounceEnabled;
}

function showHistoryChanged() {
	SHOW_HISTORY = !SHOW_HISTORY;
}

function updateZoom() {
	SCALE = this.value;
	this.readOut.innerHTML = this.value;
}

function numThingsChanged() {
	INITIAL_NUM_THINGS = this.value;
	this.readOut.innerHTML = this.value;
}

function trackLargestThingEnabledChanged() {
	trackLargestThingEnabled = ! trackLargestThingEnabled

	console.log(trackLargestThingEnabled);
}

function historyLengthChanged() {
	HISTORY_LENGTH = this.value;
	this.readOut.innerHTML = this.value;
}

function createInputs() {
	var div = document.createElement("DIV");

	var startStopButton = createButtonInput("start/stop", startStopClicked);
	var resetButton = createButtonInput("reset", resetClicked);
	var gravInput = createRangeInput("grav", 0, 0.25, GRAV, 0.005, updateGrav);
	var enableBounce = createCheckboxInput("enable bounce", bounceEnabled, enableBounceChanged);
	var zoomInput = createRangeInput("zoom", 0.05, 2.5, 1.0, 0.01, updateZoom);
	var numElementsInput = createRangeInput("num things", 1, 1500, INITIAL_NUM_THINGS, 1, numThingsChanged);	
	var enableTrackLargestThing = createCheckboxInput("track largest thing (ONLY WORKS WHEN SCALE = 1)", trackLargestThingEnabled, trackLargestThingEnabledChanged);
	var enableShowHistory = createCheckboxInput("enable show history", SHOW_HISTORY, showHistoryChanged);	
	var historyLength = createRangeInput("history length", 0, 100, HISTORY_LENGTH, 1, historyLengthChanged);

	div.appendChild(startStopButton);
	appendBR(div);
	div.appendChild(resetButton);
	appendBR(div);
	appendBR(div);
	div.appendChild(gravInput);
	appendBR(div);
	div.appendChild(enableBounce);
	appendBR(div);
	div.appendChild(zoomInput);
	appendBR(div);
	div.appendChild(numElementsInput);
	appendBR(div);
	div.appendChild(enableTrackLargestThing);
	appendBR(div);	
	div.appendChild(enableShowHistory);	
	appendBR(div);
	div.appendChild(historyLength);
	document.body.appendChild(div);
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
		th.push(new thing);
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

	if (trackLargestThingEnabled) {
		var largestThing = th[getLargestThingIndex()];
		translate(getZoomedWidth() / 2 - largestThing.pos.x, getZoomedHeight() / 2 - largestThing.pos.y);
	}

	scale(SCALE, SCALE);
	displayThings();
	
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

function stopAtFrameCount(count) {
	fooCount++;
	if (fooCount > count)
		while(true)
			;
}

function getTime() {
	return new Date().getTime();
}
