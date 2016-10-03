
var SIZ = 20;
var DENSITY = 1;

function thing() {
	// fields
	this.mass = 2275;
	this.x = Math.floor(Math.random() * WIDTH);
	this.y = Math.floor(Math.random() * HEIGHT);
	this.x_speed = Math.floor(Math.random() * 25);
	this.y_speed = Math.floor(Math.random() * 25);

	// public functions
	this.getRadius = function() {
		// things are 2D. density is Mass / area
		// area = pi*r^2, r = sqrt(area / pi)

		var area = this.mass / DENSITY;
		var radius = Math.sqrt(area / Math.PI);
		return radius;
	}

	this.update = function() {
		this.x += this.x_speed;
		this.y += this.y_speed;
		
		var r = this.getRadius();
		
		if (this.x <= 0 && this.x_speed < 0)
			this.x_speed *= -1;
		if (this.x >= (WIDTH - r * 2) && this.x_speed > 0)
			this.x_speed *= -1;
		if (this.y <= 0 && this.y_speed < 0)
			this.y_speed *= -1;
		if (this.y >= (HEIGHT - r * 2) && this.y_speed > 0)
			this.y_speed *= -1;
	}

	this.show = function () {
		ellipse(this.x, this.y, Math.floor(this.getRadius()),
					Math.floor(this.getRadius()));
	}

}
