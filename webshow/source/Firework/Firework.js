var delta_t = 0.3
var bgColor
var fields = []
var fireworks = []
//var tails = []

function setup() {
	bgColor = color('#0')
	createCanvas(windowWidth, windowHeight)
	fields.push(Field(createVector(0, 1)))
}

function draw() {
	background('rgba(0,0,0, 0.1)');
	for(let i = fireworks.length-1;i >= 0;--i) {
		fireworks[i].update();
		fireworks[i].show();
		if(fireworks[i].isDead()) {
			fireworks[i].subFireworks = null;
			fireworks.splice(i, 1);
		}
	}
	/*
	for(let i = tails.length-1;i >= 0;--i) {
		tails[i].update();
		tails[i].show();
		if(tails[i].isDead()) {
			print("dead")
			tails.splice(i, 1);
		}
	}
	*/
	if(cd != 0)
		cd--;
	showFps();
}

var tMouseX, tMouseY;
function mousePressed() {
  tMouseX = mouseX;
  tMouseY = mouseY;
}

var cd = 3
function mouseReleased() {
	if(cd == 0) {
  	new DoubleFirework(createVector(mouseX, mouseY), createVector((mouseX-tMouseX)/10, (mouseY-tMouseY)/10-20+random(-10, 10)), random(5, 15));
		cd = 3
	}
}