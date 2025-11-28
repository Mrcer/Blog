function PreFirework(radius, v, c, run_time, tail) {
    this.summon = function(mather) {
      f = new Firework(mather.p.copy(), v, tail);
      f.setColor(c);
      f.setRadius(radius);
      f.setRunTime(run_time);
          fireworks.push(f)
    }
  }
  
  function DoubleFirework(p, v){
    var subFireworks = [];
    var self = new Firework(p, v, new Tail(25, color('#6C7CFF')));
      self.setRadius(10);
      self.setRunTime(20);
    self.setColor(color('#6C7CFF'));
      colorMode(HSB, 360, 100, 100);
      var subColor_1 = color(random(0, 360), 60, 100);
    var subColor_2 = color(random(0, 360), 60, 100);
    var subSpeed_1 = 5;
    var subSpeed_2 = 10;
      for(let i = 0;i < 360;i+= random(10, 30)) {
      subTail = new Tail(self.run_time/4, subColor_1, self.radius/4);
      pf = new PreFirework(self.radius/4, createVector(subSpeed_1*sin(radians(i)), subSpeed_1*cos(radians(i))), subColor_1, self.run_time, subTail);
      subFireworks.push(pf);
    }
    for(let i = 15;i < 360;i+= random(10, 30)) {
      subTail = new Tail(self.run_time/2, subColor_2, self.radius/4);
      pf = new PreFirework(self.radius/4, createVector(subSpeed_2*sin(radians(i)), subSpeed_2*cos(radians(i))), subColor_2, self.run_time, subTail);
      subFireworks.push(pf);
    }
      fireworks.push(this);
      
      this.isDead = function() {
          return self.statue;
      }
      
      this.update = function() {
          self.update()
          if(self.isDead()) {
              statue = true
              for(let i = 0;i < subFireworks.length;++i)
            subFireworks[i].summon(self);
          }
      }
      
      this.show = function() {
          self.show();
      }
  }