function Field(a) {
    this.force = function(e) {
      return a.copy()
    }
      return this
  }
  
  function Element(p, v) {
    var run_time = 100
    
      this.setRunTime = function(t) {
          run_time = t
      }
      
    this.update = function() {
      for(let f in fields)
        v.add(f.force(this).mult(delta_t))
      p.add(v.copy().mult(delta_t))
      run_time-=delta_t
    }
  }
  
  function Tail(run_time, c, r) {
      var length = (int)(run_time / delta_t)
    var shift = 0
    var statue = false
    var matherDead = false
    var path = new Queue(length)
    
    this.add = function(p) {
      path.push_up(p.copy())
    }
    
    this.setRunTime = function(t) {
      length = parseInt(t / delta_t)
    }
    
    this.setColor = function(tc) {
      c = tc
    }
    
    this.dead = function() {
      matherDead = true
    }
    
      this.isDead = function() {
          return statue;
      }
      
    this.update = function() {
      if(matherDead)
        shift++;
      if(shift == length)
        statue = true;
      }
      
    this.show = function() {
      strokeWeight(r);
      let count = shift + path.size()
      let it = new path.Iterator(path)
          let i = 0
          let pre = it.next();
      while(it.hasNext()) {
        let next = it.next();
        stroke(lerpColor(c, bgColor, count / length));
        line(pre.x, pre.y, next.x, next.y);
        pre = next;
        --count;
      }
    }
  }
  
  function Firework(p, v, tail){
      this.p = p;
      this.v = v;
    this.run_time = 100
    this.statue = false
      this.c = color(0xFFFFFF);
      this.radius = 10;
    this.tail = tail;
  //	tails.push(tail);
    
    this.getTail = function() {
      return this.tail;
    }
    
      this.setRunTime = function(t) {
          this.run_time = t
      }
      
    this.setColor= function(c) {
      this.c = c;
    }
    
    this.setRadius = function(r) {
      this.radius = r;
    }
    
      this.isDead = function() {
          return this.statue
      }
      
    this.update = function() {
          for(let i = fields.length-1;i >= 0;--i)
        this.v.add(fields[i].force(this).mult(delta_t));
      this.p.add(this.v.copy().mult(delta_t));
      this.run_time-=delta_t;
      if(this.run_time < 0)
        this.statue = true;
      tail.add(p);
      if(this.statue)
        this.dead();
    }
    
    this.dead = function() {
      tail.dead();
          tail = null;
    }
    
    this.show = function() {
      fill(this.c);
      noStroke();
      ellipse(this.p.x, this.p.y, this.radius, this.radius);
    }
  }