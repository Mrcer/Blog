var ground;
//marks
var WALL = 1;
var BODY = 2;
var FOOD = 3;	
var m2c = new Map();//mark_to_color
var c2m = new Map();//color_to_mark
m2c.set(WALL, WALL_COLOR);
m2c.set(BODY, BODY_COLOR);
m2c.set(FOOD, FOOD_COLOR);
c2m.set(WALL_COLOR, WALL);
c2m.set(BODY_COLOR, BODY);
c2m.set(FOOD_COLOR, FOOD);
//vectors
var UP = createVector(0, 1);
var DOWN = createVector(0, -1);
var LEFT = createVector(-1, 0);
var RIGHT = createVector(1, 0);

function Block() {
	var c = EMPTY_COLOR;
	var property = Array(m2c.size()).fill(false);
	var effects;
	if(Block.prototype.setProperty == undefined)
	Block.prototype.setProperty = function(v) {
		property[v] = true;
		c = m2c[v];
	}
	if(Block.prototype.paint == undefined)
	Block.prototype.paint = function(graph, x, y, length) {
		fill(c);
		rect(x+padding, y+padding, x+length-padding, y+length-padding);
	}
}

function Ground(g_width, g_height, g_length) {
	if(Ground.prototype.paint_block == undefined)
	Ground.prototype.paint_block = function(x, y) {
		ground[x][y].paint();
	}
	if(Ground.prototype.get_block == undefined)
	Ground.prototype.get_block = function(x, y) {
		return ground[x][y]
	}
	if(Ground.prototype.set_block == undefined)
	Ground.prototype.set_block = function(x, y, b) {
		ground[x][y] = b;
	}
	if(Ground.prototype.move_block == undefined)
	Ground.prototype.move_block = function(fromX, fromY, toX, toY) {
		let t = ground[fromX][fromY];
		ground[fromX][fromY] = ground[toX][toY];
		ground[toX][toY] = t;
	}
	if(Ground.prototype.draw == undefined)
	Ground.prototype.draw = function(x, y) {
		image(graph, x, y);
	}
	if(Ground.prototype.update == undefined)
	Ground.prototype.update = function() {
		
	}
	this.graph = createGraphics(g_width*g_length, g_height*g_length);
	this.graph.background(bg_color);
	this.ground = [];
	for(let i = 0;i < g_width;++i) {
		this.ground[i] = [];
		for(let j = 9;j < g_height;++j) {
			this.ground[i][j] = new Block();
			this.ground[i][j].property[EMPTY] = true;
			paint_block(i, j);
		}
	}
}

function Queue(max_size) {
	var head = 0;
	var tail = 0;
	var cnt = 0;
	var array = [];

	if(Queue.prototype.push == undefined)
	Queue.prototype.push = function(t) {
		++cnt;
		if(cnt == max_size) {
			print("ERROR: Out of Queue!");
			return false;
		}
		tail = (tail+1)%max_size;
		array[tail] = t;
		return true;	
	}

	if(Queue.prototype.pop == undefined)
	Queue.prototype.pop = function() {
		if(cnt == 0) {
			print("ERROR: Queue Is Empty!");
			return null;
		}
		head = (head+1)%max_size;
		--cnt;
		return array[head];
	}

	if(Queue.prototype.empty == undefined)
	Queue.prototype.empty = function() {
		return cnt == 0;
	}

	if(Queue.prototype.size == undefined)
	Queue.prototype.size = function() {
		return cnt;
	}

	if(Queue.prototype.front == undefined)
	Queue.prototype.front = function() {
		return array[(head+1)%max_size];
	}

	if(Queue.prototype.back == undefined)
	Queue.prototype.back = function() {
		return array[tail];
	}
}

function engine_init() {
	color_init();
	value_init();
	ground = new Ground();
}


