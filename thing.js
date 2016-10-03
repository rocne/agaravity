
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
		var myMomentumX = this.vel.x * this.mass;
		var myMomentumY = this.vel.y * this.mass;
		var theirMomentumX = otherThing.vel.x * otherThing.mass;
		var theirMomentumY = otherThing.vel.y * otherThing.mass;

		var totalMomentumX = myMomentumX + theirMomentumX;
		var totalMomentumY = myMomentumY + theirMomentumY;

		var totalMomentumMagnitude = Math.sqrt(totalMomentumX * totalMomentumX + totalMomentumY * totalMomentumY);


	}

	this.absorb = function (otherThing) {
		this.mass += otherThing.mass;

		otherThing.shouldBeDestroyed = true;
	}

	this.update = function() {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		
		var r = this.getRadius();
		
		if (this.pos.x <= 0 && this.vel.x < 0)
			this.vel.x *= -1;
		if (this.pos.x >= (WIDTH - r * 2) && this.vel.x > 0)
			this.vel.x *= -1;
		if (this.pos.y <= 0 && this.vel.y < 0)
			this.vel.y *= -1;
		if (this.pos.y >= (HEIGHT - r * 2) && this.vel.y > 0)
			this.vel.y *= -1;
	}

	this.show = function () {
		ellipse(this.pos.x, this.pos.y, Math.floor(this.getRadius()),
					Math.floor(this.getRadius()));
	}

}
