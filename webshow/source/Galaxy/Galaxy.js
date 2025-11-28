var stars = [];
var star_falls = [];
var bg = null;

function setup() {
	createCanvas(windowWidth, windowHeight);
	create_background();
	big_bang();
}

function draw() {
	background(0);
	create_background();
	light_up()
	sf_manager();
}

let timer_count = 0;
function timer() {
	if(timer_count == 0) {
		timer_count = millis();
	} else {
		print(millis() - timer_count);
		timer_count = 0;
	}
}

function create_background_old() {
	if(bg != null) {
		image(bg, 0, 0);
		return;
	}
	bg = createImage(width, height);
	center = color('#00154d');
	outside = color('#000000');
	centerX = width /2;
	centerY = 0;
	radius = sqrt(sq(height) + sq(width));
	bg.loadPixels();
	for(let i = 0;i <= width;i++) {
		for(let j = 0;j <= height;j++) {
			c = lerpColor(center, outside, dist(centerX, centerY, i, j)/radius);
			bg.set(i, j, c);
		}
	}
	bg.updatePixels();
}

function create_background() {
	if(bg != null) {
		image(bg, 0, 0);
		return;
	}
	bg = createGraphics(width, height);
	center = color('#00154d');
	outside = color('#000000');
	centerX = width /2;
	centerY = 0;
	radius = sqrt(sq(height) + sq(width));
	bg.strokeWeight(32)
	for(let i = 0;i <= width;i+=10) {
		for(let j = 0;j <= height;j+=10) {
			c = lerpColor(center, outside, dist(centerX, centerY, i, j)/radius);
			bg.stroke(c);
			bg.point(i, j, c);
		}
	}
}

function big_bang() {
	for(let i = 0;i < 300;++i) {
		x = random(0, width);
		y = height*sq(random(0, 1));
		c = color(255,255,255, random(100,255));
		r = random(1, 5)
		v= random(0.5,1);
		stars.push(new Star(x, y, c, r, v));
	}
}

function light_up() {
	for(let i = 0;i < stars.length;++i) {
		stars[i].update();
		stars[i].show();
	}
}

function Star(x, y, c, r, v) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.v = v;
	this.c = c;
}

Star.prototype = {
	constructor : Star,
	update: function() {
		this.x = (this.x+(0.2*sin( this.x/width *PI)+0.1)*this.v)%width;
		if(random(0, 100) > 99) 
			shown = false;
		else
			shown = true;
	},
	
	show: function() {
		if(shown) {
			stroke(this.c);
			strokeWeight(this.r);
			point(this.x, this.y);
		}
	}
}

function sf_manager() {
	//Create new starfall
	if(random(0,100) > 99) {
		x = random(0, width);
		y = height*sq(random(0, 1))*0.3;
		colorMode(HSB, 360, 100, 100);
		c = color(random(200, 300), 20, 100);
		d = random(500, 1000);
		r = d/250
		star_falls.push(new StarFall(x, y, c, r, d))
	}
	//update all animation
	for(let i = star_falls.length-1;i>=0;--i) {
		if(star_falls[i].show()) star_falls.splice(i, 1);
	}
}

function StarFall(x, y, c, r, d) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.d = d;
	this.c = c;
	this.animator = createGraphics(d*2, d*2);
	this.animator.translate(d, d);
	this.animator.rotate(PI/6);
	this.frame = 0;
}

StarFall.prototype = {
	constructor : StarFall,
	v : 0.03,
	show : function() {
		this.animator.erase(50,50);
		this.animator.rect(-this.d, -this.d, this.d*2, this.d*2);
		this.animator.noErase();
		image(this.animator, this.x-this.d, this.y-this.d);
		this.frame += this.v;
		if(this.frame >= 1) {
			if(this.frame >= 2) return true;
		} else {
			this.animator.stroke(this.c);
			this.animator.strokeWeight(this.r);
			this.animator.line(0, (this.frame-this.v)*this.d, 0, this.frame*this.d);
			return false;
		}
	}
}
function dist(x1, y1, x2, y2) {
	return sqrt(sq(x1-x2)+sq(y1-y2));
}