var started = false;
var start_time;
var pause_time;
var freezed = true;
var tex;
var marks;
function setup() {
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER);
	size = min(min(200, width/10), height/2);
	textSize(size);
	frameRate(120);
	tex = '00 : 00 : 000';
	text(tex, width/2, height/2);
	noLoop();
}

function draw() {
	if(freezed) return;
	var timer = new Date();
	time = timer.getTime() - start_time;
	background('#ffffff');
	var min, sec;
	mil = time % 1000;
	time /= 1000;
	min = floor(time / 60);
	sec = floor(time % 60);
	tex = '';
	if(min < 10) tex = tex.concat('0');
	tex = tex.concat(min);
	tex = tex.concat(' : ');
	if(sec < 10) tex = tex.concat('0');
	tex = tex.concat(sec);
	tex = tex.concat(' : ');
	if(mil < 100) tex = tex.concat('0');
	if(mil < 10) tex = tex.concat('0');
	tex = tex.concat(mil);
	text(tex, width/2, height/2);
}

function reset() {
	var timer = new Date();
	if(!started) {
		start_time = timer.getTime();
		loop();
		freezed = false;
		started = true;
	} else {
		print(tex);
		noLoop();
		freezed = true;
		started = false;
	}
}

function pause() {
	if(!started) {
		reset();
		return;
	}
	if(freezed) {
		var timer = new Date();
		start_time += timer - pause_time
		loop();
		freezed = false;
	} else {
		pause_time = new Date();
		print(tex);
		noLoop();
		freezed = true;
	}
}

function mouseClicked() {
	reset();
}

function keyPressed() {
	if(key == ' ')
		pause();
	if(key == 'f') {
		if(fullscreen())
			fullscreen(false);
		else
			fullscreen(true);
	}
	return false;
} 

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	size = min(min(200, width/10), height/2);
	textSize(size);
	text(tex, width/2, height/2);
}
