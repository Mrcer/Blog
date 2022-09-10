var speed = 12
var speed2 = 1
var cd = 0
var fromX = -2
var toX = 2
var fromY = -2
var toY = 2
var painters = []
var move
function setup() {
    createCanvas(windowWidth, windowHeight)
	move = createCpx(speed/width, 0)
	strokeWeight(10)
	frameRate(120)
}

var now = 0
function draw() {
	colorMode(HSB, 360, 100, 100)
	while(painters.length < 1000) {
		/*
		if(now > height) break
		let pos = createCpx(fromX, map(now++, 0, height, fromY, toY))
		painters.push(new Partical(pos, move))
		*/
		
		let pos = createCpx(random(fromX, toX), random(fromY, toY))
		painters.push(new Partical(pos, move))
		
	}
	for(let k = 0; k < speed2;++k)
		for(let i = painters.length-1;i >= 0;--i) {
			painters[i].update()
			if(painters[i].dead)
				painters.splice(i, 1)
		}
	if(cd > 0) cd--
}

function mouseClicked() {
	if(cd == 0) {
		x = map(mouseX, 0, width, fromX, toX)
		y = map(mouseY, 0, height, fromY, toY)
		fromX = (x+fromX)/2
		toX = (x+toX)/2
		fromY = (y+fromY)/2
		toY = (y+toY)/2
		move.div(2)
		print(fromX, toX, fromY, toY)
		painters = []
		cd = 0
		now = 0
	}
}

function keyPressed() {
	if(key == 'r') {
		fromX = -2
		toX = 2
		fromY = -2
		toY = 2
		move = createCpx(0.005, 0.005)
		painters = []
		print(fromX, toX, fromY, toY)
		now = 0
	}
}

function Partical(pos, move) {
	this.pos = pos
	this.move = move
	this.dead = false
}

Partical.prototype = {
	constructor : Partical,
	c0 : createCpx(-0.577, 0.511),
	//c0 : createCpx(-0.9, 0.1),
	max_time : 360,
	f : function(z) {
		return z.mult(z).add(this.c0)
	},
	calculate : function() {
		let z = this.pos.copy()
		let times = 0
		while(z.mag() <= 2) {
			if(times > this.max_time)
				return -1
			z = this.f(z)
			times++
		}
		return times
	},
	draw : function(times) {
		if(times == -1) 
			stroke(0)
		else
			stroke(color(times, 100, 100))
		point(map(this.pos.real, fromX, toX, 0, width), map(this.pos.img, fromY, toY, 0, height))
	},
	update : function() {
		this.pos.add(move)
		if(this.pos.real < fromX || this.pos.real > toX || this.pos.img < fromY || this.pos.img > toY)
			this.dead = true
		let times = this.calculate()
		this.draw(times)
	}
}
