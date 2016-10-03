
var SIZ = 20;
var DENSITY = 1;

function thing() {
	// fields
	this.mass = 2275 + Math.random() * 100;
	this.pos = createVector(Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
	this.vel = createVector(Math.floor(Math.random() * 25), Math.floor(Math.random() * 25));	
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

	this.isCollidingWith = function(otherThing) {
		return this.distanceTo(otherThing) <= this.getRadius() + otherThing.getRadius();
	}

	this.getCombinedMomentum = function(otherThing) {
		var myMomentum = p5.Vector.mult(this.vel, this.mass);
		var theirMomentum = p5.Vector.mult(otherThing.vel, otherThing.mass);		
		var totalMomentum = p5.Vector.add(myMomentum, theirMomentum);
		return totalMomentum;
	}

	this.absorb = function (otherThing) {
		var totalMomentum = this.getCombinedMomentum(otherThing);
		this.mass += otherThing.mass;

		this.vel = p5.Vector.mult(totalMomentum, 1.0 / this.mass);

		otherThing.shouldBeDestroyed = true;
	}

	this.update = function() {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		
		var r = this.getRadius();
		
		if (this.pos.x - r <= 0 && this.vel.x < 0)
			this.vel.x *= -1;
		if (this.pos.x >= WIDTH - r && this.vel.x > 0)
			this.vel.x *= -1;
		if (this.pos.y - r <= 0 && this.vel.y < 0)
			this.vel.y *= -1;
		if (this.pos.y >= HEIGHT - r && this.vel.y > 0)
			this.vel.y *= -1;
	}

	this.show = function () {
		ellipse(this.pos.x, this.pos.y, 2 * Math.floor(this.getRadius()));
	}

}
