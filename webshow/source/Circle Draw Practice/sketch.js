/**
* This program estimate your path using an empirical approach and it could be inaccurate sometimes (see runTest comment)
* So it's possible that the low rank is not your fault
* press 't' to test the estimation
*/
var drawBuffer = []
var drawing = false;
var pathCenter;
var estimatedRadius = 0;
var error = 0;
var fillColor = 100;
var comment = '';
var combo = 0;
var score = 0;
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	angleMode(DEGREES);
	ellipseMode(RADIUS);
	textAlign(CENTER);
	pathCenter = createVector(0, 0);
	estimatedRadius = 0;
}

var testEnabled = true;
var startTime = 0;
function draw() {
	background(255);
	// press 't' to test
	if(testEnabled && keyIsDown(84)) {
		runTest();
		testEnabled = false;
	}
	if(mouseIsPressed) {
		if(!drawing) {
			drawing = true;
			drawBuffer = [];
			startTime = millis();
		}
		drawBuffer.push(createVector(mouseX, mouseY))
	} else {
		if(drawing) {
			print('time elapse (s): ', (millis() - startTime) / 1000);
			submitCircle();
			drawing = false;
		} else {
			fillPath();
			paintEstimatedCircle();
			paintComment();
		}
	}
	paintPath();
	paintPivot();
}

// My test result shows that
// human draw about 60 segment per round
// ClipPath() could go too much if the segment goes too low
// calPreciseCenter is still not accurate enough if randomGaussian is not added to the test
// maybe someone good at CV can help me fix it ...
function runTest() {
	segment = 64;
	theta = 360 / segment;
	o = createVector(windowWidth/2, windowHeight/2);
	r = min(windowWidth/2, windowHeight/2) * 0.7;
	v = createVector(r, 0);
	drawBuffer = []
	for(let i = 0 ; i <= segment * 1.2; i++) {
		drawBuffer.push(p5.Vector.rotate(v, (i + randomGaussian(0, 0.1)) * theta).add(o));
	}
	drawing = true;
}

function paintPivot() {
	stroke(0);
	strokeWeight(5);
	line(mouseX - 10, mouseY, mouseX + 10, mouseY);
	line(mouseX, mouseY - 10, mouseX, mouseY + 10);
}

function paintPath() {
	stroke(0);
	fill(0);
	strokeWeight(2);
	for(let i = 1 ; i < drawBuffer.length ; i++) {
		line(drawBuffer[i-1].x, drawBuffer[i-1].y, drawBuffer[i].x, drawBuffer[i].y);
	}
}

function fillPath() {
	stroke(0);
	fill(fillColor, 80);
	strokeWeight(2);
	beginShape();
	for(let i = 1 ; i < drawBuffer.length ; i++) {
		vertex(drawBuffer[i].x, drawBuffer[i].y);
	}
	endShape();
}

function paintEstimatedCircle() {
	colorMode(RGB);
	stroke(255,0,0,80);
	fill(0,0);
	ellipse(pathCenter.x, pathCenter.y, estimatedRadius, estimatedRadius);
}

function paintComment() {
	colorMode(RGB);
	fill(0, 80);
	strokeWeight(0);
	textSize(estimatedRadius * 0.5);
	text(comment, pathCenter.x, pathCenter.y);
	textSize(estimatedRadius * 0.3);
	if(combo >= 3) {
		text('combo ' + combo, pathCenter.x, pathCenter.y + estimatedRadius * 0.3);
	}
}

// average all points and store it in pathCenter
function calCoarseCenter() {
	pathCenter = createVector(0, 0);
	for(let i = 0 ; i < drawBuffer.length; i++) {
		pathCenter.add(drawBuffer[i]);
	}
	pathCenter.div(drawBuffer.length);
	// print(pathCenter.x, pathCenter.y);
}

// clip the path and calculate curve integration
function ClipPath() {
	intPath = 0;
	sumUpAngle = 0;
	sumUpPoint = 1;
	for(let i = 1 ; i < drawBuffer.length && abs(sumUpAngle) <= 360; i++) {
		intPath += p5.Vector.sub(drawBuffer[i-1], drawBuffer[i]).mag();
		vec1 = p5.Vector.sub(drawBuffer[i-1], pathCenter);
		vec2 = p5.Vector.sub(drawBuffer[i], pathCenter);
		sumUpAngle += p5.Vector.angleBetween(vec1, vec2);
		sumUpPoint++;
	}
	drawBuffer.length = sumUpPoint;
	// print(intPath);
	return intPath;
}

// calculate center using curve integration
function calPreciseCenter(intPath) {
	pathCenter = createVector(0, 0);
	for(let i = 1 ; i < drawBuffer.length; i++) {
		mid = p5.Vector.add(drawBuffer[i-1], drawBuffer[i]).div(2);
		dPath = p5.Vector.sub(drawBuffer[i-1], drawBuffer[i]).mag();
		pathCenter.add(mid.mult(dPath / intPath));
	}
	// print(pathCenter.x, pathCenter.y);
}

function calRadius(intPath) {
	estimatedRadius = 0;
	for(let i = 1 ; i < drawBuffer.length; i++) {
		mid = p5.Vector.add(drawBuffer[i-1], drawBuffer[i]).div(2)
		dPath = p5.Vector.sub(drawBuffer[i-1], drawBuffer[i]).mag()
		estimatedRadius += mid.sub(pathCenter).mag() * (dPath / intPath);
	}
	// print(estimatedRadius);
}

function calError(intPath) {
	error = 0
	for(let i = 1 ; i < drawBuffer.length; i++) {
		mid = p5.Vector.add(drawBuffer[i-1], drawBuffer[i]).div(2)
		dPath = p5.Vector.sub(drawBuffer[i-1], drawBuffer[i]).mag()
		error += sq(mid.sub(pathCenter).mag() - estimatedRadius) * dPath;
	}
	error = sqrt(error) / intPath;
	return error;
}

function calFillColor() {
	colorMode(RGB);
	wrongColor = color(200, 0, 0);
	correctColor = color(0, 200, 0);
	colorMode(HSB);
	fillColor = lerpColor(wrongColor, correctColor, map(score, 0, 100, 0, 1, true));
}

function calScore() {
	a = 0.05 	// scale to score, larger is more sensitive
	b = 2		// compensation for small circle
	rmse_measure = error / estimatedRadius
	size_measure = 2 * estimatedRadius / min(windowWidth, windowHeight)
	score = 100 * exp(- a * rmse_measure * exp(size_measure * b));
	print('comment data (score,rmse_measure,size_measure) ', score, rmse_measure, size_measure);
}

function calComment() {
	if(score > 90) {
		comment = 'Perfect!';
		combo += 1;
	} else if(score > 75) {
		comment = 'Fine';
		combo = 0;
	} else if(score > 60) {
		comment = 'hmm..';
		combo = 0;
	} else {
		comment = 'err..';
		combo = 0;
	}
}

function submitCircle() {
	calCoarseCenter();
	intPath = ClipPath(); // use coarse estimated center to clip
	calPreciseCenter(intPath);
	calRadius(intPath);
	error = calError(intPath) * 1000; // mean sqrt error (x1000)
	calScore();
	calFillColor();
	calComment();
	print('mse error (x1000): ', error);
}