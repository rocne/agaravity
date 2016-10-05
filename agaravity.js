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

var inputs = {};

var stopped = false;

window.onload = function() {
}

function resetClicked() {
	th = [];
	createThings(INITIAL_NUM_THINGS);			
}

function createButtonInput(name, clickedFunction) {
	var input = document.createElement("BUTTON");
	input.setAttribute("name", name);
	input.onclick = clickedFunction;
	input.innerHTML = name;
	inputs[name] = input;
	return input;
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
	inputs[name] = input;

	var label = document.createElement("LABEL");
	label.setAttribute("for", name);
	label.innerHTML = name;	

	var readOut = document.createElement("SPAN");
	readOut.innerHTML = defaultValue;
	input.readOut = readOut;
	
	label.appendChild(input);
	label.appendChild(readOut);
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
	console.log("updated grav to " + value);

}

function setWindowDimensions() {
	HEIGHT = window.innerHeight * 0.95;
	WIDTH = window.innerWidth * 0.95;

	if (WIDTH == 0 || HEIGHT == 0)
		WIDTH = HEIGHT = 1080;
}

function createInputs() {
	var div = document.createElement("DIV");

	var startStopButton = createButtonInput("start/stop", startStopClicked);
	var resetButton = createButtonInput("reset", resetClicked);
	var gravInput = createRangeInput("grav", 0, 0.25, GRAV, 0.005, updateGrav);

	div.appendChild(startStopButton);
	div.appendChild(document.createElement("BR"));
	div.appendChild(resetButton);
	div.appendChild(document.createElement("BR"));
	div.appendChild(gravInput);
	div.appendChild(document.createElement("BR"));

	document.body.appendChild(div);
}

function setup() {
	createInputs();	
	setWindowDimensions();

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

	displayThings();
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
