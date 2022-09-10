var delta_t;
var block_len = 10;
var SNAKE_COLOR = 0;
var EMPTY_COLOR;
var WALL_COLOR;
var FOOD_COLOR;
var EMPTY = 0;
var WALL = 1;
var BODY = 2;
var FOOD = 4;
var ground = [];
var body = [];
var head = 0;
var tail = 0;
var cnt = 0;
var body_len = 3;
var max_len = 3600;
var dirt = [];
var oppo_dirt = [];
var map_width;
var map_height;
var die = false;
var forehead;

function config() {
	delta_t = 2;
	EMPTY_COLOR = color('#ffffff');
	SNAKE_COLOR = 0;
	WALL_COLOR = 0;
	FOOD_COLOR = color('#00ff00');
}

function setup() {
	strokeWeight(1);
	noSmooth();
	dirt[0] = createVector(0, -1);
	dirt[1] = createVector(0, 1);
	dirt[2] = createVector(-1, 0);
	dirt[3] = createVector(1, 0);
	oppo_dirt[UP_ARROW] = DOWN_ARROW;
	oppo_dirt[DOWN_ARROW] = UP_ARROW;
	oppo_dirt[LEFT_ARROW] = RIGHT_ARROW;
	oppo_dirt[RIGHT_ARROW] = LEFT_ARROW;
	createCanvas(400, 400);
	config();
	map_width = ceil(width / block_len);
	map_height = ceil(height / block_len);
	for(let i = 0;i < map_width;++i) {
		ground[i] = [];
		for(let j = 0;j < map_height;++j) {
			ground[i][j] = EMPTY;
			paint_block(i, j, EMPTY_COLOR);		
		}
	}
	/*
	for(let i = 0;i < map_width;++i) {
		ground[0][i] = WALL;
		ground[map_width-1][i] = WALL;
		paint_block(0, i, WALL_COLOR);
		paint_block(map_width-1, i, WALL_COLOR);		
	}
	for(let i = 0;i < map_width;++i) {
		ground[i][0] = WALL;
		ground[i][map_height-1] = WALL;
		paint_block(i, 0, WALL_COLOR);
		paint_block(i, map_height-1, WALL_COLOR);		
	}
	*/
	push_body(createVector(1, 1));
	ground[1][1] = BODY;
	now_dirt = DOWN_ARROW;
	forehead = now_dirt;
	summon_food();
}

var t = delta_t;
var now_dirt;
function draw() {
	if(die) return;
	if(t > 0) {
		--t;
		return;
	}
	if(cnt >= body_len) {
		die_out = pop_body();
		ground[die_out.x][die_out.y] = EMPTY;
		paint_block(die_out.x, die_out.y, EMPTY_COLOR);
	}
	t = delta_t;
	advance();
}

function keyPressed() {
	now_dirt = keyCode;
}

function paint_block(x, y, c) {
	fill(c);
	rect(x*block_len, y*block_len, block_len-1, block_len-1);
}

function push_body(v) {
	tail = (tail+1)%max_len;
	++cnt;
	if(cnt == max_len) {
		print("Full!");
		return false;
	}
	body[tail] = v;
	return true;
}

function pop_body() {
	if(cnt == 0) {
		print("Empty!");
		return null;
	}
	head = (head+1)%max_len;
	--cnt;
	return body[head];
}

function summon_food() {
	do{
		x = floor(random(1, map_width-2));
		y = floor(random(1, map_height-2));
	}while(ground[x][y] != EMPTY);
	ground[x][y] = FOOD;
	paint_block(x, y, FOOD_COLOR);
	
}

function lose() {
	text(width/2, height/2, "Lose")
	die = true;
}

function advance() {
	now_head = body[tail].copy();
	if(now_dirt == oppo_dirt[forehead]) now_dirt = forehead;
	switch(now_dirt) {
		case UP_ARROW: 	push_body(now_head.add(dirt[0]));
				break;
		case DOWN_ARROW: push_body(now_head.add(dirt[1]));
				break;
		case LEFT_ARROW: push_body(now_head.add(dirt[2]));
				break;
		case RIGHT_ARROW: push_body(now_head.add(dirt[3]));
	}
	now_head.x = (map_width + now_head.x) % map_width;
	now_head.y = (map_height + now_head.y) % map_height;
	switch(ground[now_head.x][now_head.y]) {
		case EMPTY: break;
		case FOOD: summon_food();
				body_len+=5;
				break;
		case BODY: lose();
			break;
		case WALL: lose();
			break;
	}
	forehead = now_dirt;
	ground[now_head.x][now_head.y] = BODY;
	paint_block(now_head.x, now_head.y, SNAKE_COLOR);
}
