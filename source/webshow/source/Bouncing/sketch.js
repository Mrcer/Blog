var end = false
var started = false
var win = false
var score_left = 0
var score_right = 0
var bar_left_y
var bar_right_y
var all_pos
var ball_v
var bar_v = 24
var bar_size_x = 25
var bar_size_y = 120
var bar_gap = 50
var ball_size = 25
var bounce_osc
var bounce_play_time
function setup() {
  createCanvas(800, 600)
  bar_left_y = bar_right_y = height / 2 - bar_size_y/2
  ball_pos = createVector(width/2, height/2)
  ball_v = createVector(30, 30)
  bounce_osc = new p5.Oscillator('triangle')
  bounce_osc.amp(0.1)
  frameRate(12)
}

function draw() {
  if(bounce_play_time > 0)
    bounce_play_time--;
  else
    bounce_osc.stop()
  update()
  display()
}

function update() {
  if(end || !started) return
  //position
  if(keyIsPressed) {
    if(keyCode === UP_ARROW)
      bar_left_y -= bar_v
    if(keyCode === DOWN_ARROW)
      bar_left_y += bar_v
    //check
    if(bar_left_y < 0) bar_left_y = 0
    if(bar_left_y > height - bar_size_y) bar_left_y = height - bar_size_y
  }
 bar_mid = bar_right_y + bar_size_y /2
  if(bar_mid > ball_pos.y)  bar_right_y -= bar_v
  if(bar_mid < ball_pos.y)  bar_right_y += bar_v
  ball_pos.add(ball_v)
  //bounce
  if(ball_pos.y <= 0 || ball_pos.y >= height) {
    ball_v.y = -ball_v.y
    playBounceAudio()
  }
  if(ball_pos.x <= bar_gap+bar_size_x && ball_pos.x >= bar_gap && 
     ball_pos.y >= bar_left_y && ball_pos.y <= bar_left_y+bar_size_y) {
        ball_v.x = -ball_v.x
        playBounceAudio()  
     }
  if(ball_pos.x >= width-bar_gap-bar_size_x && ball_pos.x <= width-bar_gap && 
     ball_pos.y >= bar_right_y && ball_pos.y <= bar_right_y+bar_size_y) {
        ball_v.x = -ball_v.x
        playBounceAudio()  
     }
  //end
  if(ball_pos.x < -10) {
    end = true
    win = false
    score_right++
    noLoop()
  }
  if(ball_pos.x > width+10) {
    end = true
    win = true
    score_left++
    noLoop()
  }
}

function display() {
  pg = createGraphics(800,600)
  pg.background(0)
  //bar and ball
  pg.fill('#8de545')
  pg.noStroke()
  pg.rect(bar_gap, bar_left_y, bar_size_x, bar_size_y)
  pg.rect(width-bar_size_x-bar_gap, bar_right_y, bar_size_x, bar_size_y)
  pg.ellipse(ball_pos.x, ball_pos.y, ball_size, ball_size)
  //lines
  pg.stroke('#ffffff')
  pg.fill('#ffffff')
  pg.strokeWeight(20)
  pg.line(width/2, 0, width/2, height)
  pg.rect(0, 0, width, 10)
  pg.rect(0, height-10, width, height)
  //socre
  pg.textSize(100)
  pg.fill('#8de545')
  pg.noStroke()
  pg.textAlign(RIGHT)
  pg.text(score_left, width/2-10, 100)
  pg.textAlign(LEFT)
  pg.text(score_right, width/2+10, 100)
  //End display
  if(end) {
    pg.textSize(200)
    pg.textAlign(CENTER)
    pg.noStroke()
    if(win) {
      pg.fill('#faff00')
      pg.text("WIN", width/2, height/2)
    }
    else {
      pg.fill('#0070ff')
      pg.text("LOSE", width/2, height/2)
    }
  }
  smaller = createGraphics(80,60)
  smaller.image(pg, 0, 0, 80, 60)
  image(smaller, 0, 0, 800, 600)
}

function keyPressed() {
  if(keyCode == ENTER && end == true) {
    end = started = false
    ball_pos = createVector(width/2, height/2)
    ball_v = createVector(30, 30)
    loop()
  }
  if(keyCode == UP_ARROW || keyCode == DOWN_ARROW)
    started = true
}

function playBounceAudio() {
    bounce_osc.start(0, 272)
    bounce_play_time = 2;
}