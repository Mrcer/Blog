var fps = 0;
function showFps() {
  if(frameCount % 12 == 0)
    fps = parseInt(frameRate())
	fill(color(0, 0, 0))
	noStroke()
	rect(0, 0, 30, 15)
  fill(color('#FFFFFF'))
  text(fps,10,10)
}