var SIZ = 20;
var DENSITY = 100;

var INDICATOR_SIZE_RATIO = 0.1;

var GRAV = 0.01;

var MAX_RAND_VEL = 25;

var BOUNCE_FACTOR = 0.9;

var HISTORY_LENGTH = 20;
var SHOW_HISTORY = true;

/* Notes
*	-rotational inertia for a disk, I = 0.5 * m * r * r 
*	-rotational momentu, L = I * angular_velocity
*
*	This is just a change to test my git settings - rocne 10/4/2016
*/

function thing() {
	// fields
	this.angle = 0;
	this.angularVelocity = 0.1;
	this.mass = 2275 + Math.random() * 100;
	this.pos = createVector(Math.floor(Math.random() * getZoomedWidth()), Math.floor(Math.random() * getZoomedHeight()));
	this.vel = createVector(Math.floor(Math.random() * 2 * MAX_RAND_VEL) - MAX_RAND_VEL, 
				Math.floor(Math.random() * 2 * MAX_RAND_VEL) - MAX_RAND_VEL);	
	this.isLocked = false;

	this.history = [];

	this.accumulatedForce = createVector(0, 0);
	this.shouldBeDestroyed = false;

	// public functions
	this.getRadius = function() {
		// things are 2D. density is Mass / area
		// area = pi*r^2, r = sqrt(area / pi)

		var area = this.mass / DENSITY;
		var radius = Math.sqrt(area / Math.PI);
		return radius;
	}

	this.distanceTo = function(otherThing) {
		var vectorToOther = p5.Vector.sub(this.pos, otherThing.pos);
		var dist = vectorToOther.mag();
		return dist;
	
	}

	this.accumulateForce = function(force) {
		this.accumulatedForce.add(force);
	}
	
	this.toggleLocked = function() {
		this.isLocked = !this.isLocked;
	}

	this.applyAccumulatedForce = function() {
		var accelarationMag = this.accumulatedForce.mag() / this.mass;
		if (this.accumulatedForce.mag() == 0)
			accelarationMag = 0;
	
		var accelaration = this.accumulatedForce.copy();
		accelaration.normalize();
		accelaration.mult(accelarationMag);
		
		this.vel.add(accelaration);
		this.accumulatedForce.set(0, 0);
	}

	this.isCollidingWith = function(otherThing) {
		return this.distanceTo(otherThing) <= this.getRadius() + otherThing.getRadius();
	}

	this.getGravitationalForce = function(otherThing) {
		var r = this.distanceTo(otherThing);
		var grav = GRAV * this.mass * otherThing.mass / (r * r);
		var gravVector = p5.Vector.sub(otherThing.pos, this.pos);
		gravVector.normalize();
		gravVector.mult(grav);
		return gravVector;

	}

	this.getCombinedMomentum = function(otherThing) {
		// momentum = mass * velocity
		var myMomentum = p5.Vector.mult(this.vel, this.mass);
		var theirMomentum = p5.Vector.mult(otherThing.vel, otherThing.mass);		
		var totalMomentum = p5.Vector.add(myMomentum, theirMomentum);
		return totalMomentum;
	}

	this.absorb = function (otherThing) {
		var totalMomentum = this.getCombinedMomentum(otherThing);
		this.mass += otherThing.mass;

		// this conserves momentum. Get the total momentum, then 
		// figure out how fast the combined mass would be going with that momentum.
		this.vel = p5.Vector.mult(totalMomentum, 1.0 / this.mass);

		otherThing.shouldBeDestroyed = true;
	}

	this.update = function() {
		this.updateHistory();
		this.updatePositionAndAngle();
		if (bounceEnabled)
			this.handleEdgeBounce();
	}

	this.handleEdgeBounce = function() {
		var r = this.getRadius();
		
		var h = getZoomedHeight();
		var w = getZoomedWidth();

		// bounce the balls off the edges of the play area
		if (this.pos.x - r <= 0 && this.vel.x < 0)
			this.vel.x *= -BOUNCE_FACTOR;
		if (this.pos.x >= w - r && this.vel.x > 0)
			this.vel.x *= -BOUNCE_FACTOR;
		if (this.pos.y - r <= 0 && this.vel.y < 0)
			this.vel.y *= -BOUNCE_FACTOR;
		if (this.pos.y >= h - r && this.vel.y > 0)
			this.vel.y *= -BOUNCE_FACTOR;
	}

	this.updatePositionAndAngle = function() {
		if (!this.isLocked) {
			this.pos.add(this.vel);
			this.angle += this.angularVelocity;
		}
	}
	
	this.updateHistory = function() {
		this.history.push(this.pos.copy());
		while(this.history.length > HISTORY_LENGTH)
			this.history.shift();		
	}
	
	this.show = function () {
		var r = Math.floor(this.getRadius());
		
		var r_indicator = r * (1 - INDICATOR_SIZE_RATIO);
		var indicatorOffset = createVector(Math.cos(this.angle), Math.sin(this.angle)).mult(r_indicator);
		var posIndicator = p5.Vector.add(this.pos, indicatorOffset);
	

		fill(20);
		ellipse(this.pos.x, this.pos.y, 2 * r);
		

		fill(200);
		ellipse(this.pos.x, this.pos.y, r);	
		
		fill(255, 0, 0);		
		ellipse(posIndicator.x, posIndicator.y, 2 * r * INDICATOR_SIZE_RATIO);

		if (SHOW_HISTORY) {
			for (var i = 0; i < this.history.length; i++) {
				var framesSinceCapture = this.history.length - i;
				var alpha = 1.0 / framesSinceCapture;
				var r = 0;
				var g = 128;
				var b = 200;
				var rgba = "rgba(" + r + "," + g +"," + b + "," + alpha + ")";
				fill(rgba);

				ellipse(this.history[i].x, this.history[i].y, (1 - i / this.history.length) * this.getRadius());
			}
		}
	}

}
