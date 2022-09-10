var drawWidth
var drawHeight
//var seed = "F--F--F"
var turnAngle = 60
var mScale = 1
var fromColor
var toColor
var run_time = 1*60

//seed F A B turns angle
var seeds = [
	["F-AF--F--FA-F", "A+F-F+A", "F-A+A-F", "", 4, 60],
	["F--F--F","F+F--F+F","","",6, 60],
	["A", "F", "+BF-AFA-FB+", "-AF+BFB+FA-", 9, 90]
]

var depth = 0
var input
var sizeLeft
var screenTop
var paddingLeft
var paddingTop
var seedCount = 0
function setup() {
	createCanvas(windowWidth, windowHeight)
	//background(0)
	strokeWeight(2)
	randomInit()
	print(seeds[0][0])
	fromColor = color('#FF2781')
	toColor = color('#BDFF27')
	angleMode(DEGREES)
	input = seeds[0][0]
	init()
}

function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}

function randomInit() {
	for(let i = 0;i < 4;++i) {
		for(let j = 0;j < random(3,6);++j) {
			let ran = parseInt(random(0, 5))
			switch(ran) {
				case 0: seeds[0][i] = seeds[0][i].concat("F")
					break
				case 1: seeds[0][i] = seeds[0][i].concat("+")
					break	
				case 2: seeds[0][i] = seeds[0][i].concat("-")
					break	
				case 3: seeds[0][i] = seeds[0][i].concat("A")
					break	
				case 4: seeds[0][i] = seeds[0][i].concat("B")
					break
			}
		}
		seeds[0][i] = seeds[0][i].concat(reverseString(seeds[0][i]))
	}
	let ran = parseInt(random(0, 5))
	switch(ran) {
		case 0: seeds[0][5] = -30
			break	
		case 1: seeds[0][5] = -60
			break	
		case 2: seeds[0][5] = 90
			break	
		case 3: seeds[0][5] = -120
			break	
		case 4: seeds[0][5] = -45
			break
	}
	print(seeds)
}

var maxMove
var move
var maxStep
var step	
var angle
var x
var y
var nx
var ny
function draw() {
	translate(paddingLeft + sizeLeft, paddingTop - sizeTop)
	//line(0, 0, x, y)
	for(let i = 0;i < maxStep/run_time;++i) {
		stroke(lerpColor(fromColor, toColor, 1-abs(1-move/maxMove*2)))
		switch(input[step]) {
			case 'F': 
				nx += mScale * cos(angle)
				ny += mScale * sin(angle)
				line(x, y, nx, ny)
				x = nx
				y = ny
				move++
				break
			case '+':
				angle += turnAngle
				break
			case '-':
				angle -= turnAngle
				break
		}
		if(step < maxStep) {
			step++
		} else {
			noLoop()
			break
		}
	}
}

function init() {
	background(0)
	turnAngle = seeds[seedCount][5]
	step = 0
	mScale = 1
	move = 0
	maxMove = 0
	maxStep = input.length
	size = getSize(input, mScale)
	mScale = min(width/(size[1]-size[0]), height/(size[3]-size[2])) *0.8
	w = mScale * (size[1]-size[0])
	h = mScale * (size[3]-size[2])
	paddingLeft = (width - w)/4
	paddingTop = (height - h)/4
	sizeLeft = -size[0]*mScale
	sizeTop = size[2]*mScale	
	x = paddingLeft
	y = paddingTop
	nx = x;
	ny = y;
	angle = 0
}

function mouseClicked() {
	depth++;
	update()
	if(depth > seeds[seedCount][4]) {
		location.reload()
		/*
		depth = 0
		randomInit()
		//seedCount++
		if(seedCount == seeds.length)
			seedCount = 0
		seed = seeds[seedCount][0]
		input = seeds[seedCount][0]
		*/
	}
	init()
	loop()
}

function keyPressed() {
	var operator
	if(key > '0' && key < '9')
		operator = int(key) - '0' - 1
	else
		return
	print(operator)
	if(operator < seeds.length) {
		seedCount = operator
		depth = 0
		seed = seeds[seedCount][0]
		input = seeds[seedCount][0]
		init()
		loop()
	}
}

function update() {
	input = input.replaceAll("F", 'I')
	input = input.replaceAll("A", 'J')
	input = input.replaceAll("B", 'K')
	input = input.replaceAll("I", seeds[seedCount][1])
	input = input.replaceAll("J", seeds[seedCount][2])
	input = input.replaceAll("K", seeds[seedCount][3])
}

function getSize(input, scale) {
	var size = [0, 0, 0, 0] //fromX, toX, fromY, toY
	var angle = 0
	var x = 0
	var y = 0
	var nx = 0
	var ny = 0
	for(let i = 0;i < input.length;++i) {
		switch(input[i]) {
			case 'F': 
				nx += scale * cos(angle)
				ny += scale * sin(angle)
				size[0] = min(nx, size[0])
				size[1] = max(nx, size[1])
				size[2] = min(ny, size[2])
				size[3] = max(ny, size[3])
				x = nx
				y = ny
				maxMove++
				break
			case '+':
				angle += turnAngle
				break
			case '-':
				angle -= turnAngle
				break
		}
	}
	return size
}
