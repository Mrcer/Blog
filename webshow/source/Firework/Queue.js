function Queue(size) {
	var length = size;
	var list = [];
	var head = 0;
	var tail = 0;
	
	this.push_up = function(data) {
			list[(head++)%size] = data;
	}
	
	this.Iterator = function(self) {
			var i = self.tail;
		
			this.next = function(){
				if(self.tail != self.head) {
					return self.list[(this.i++)%self.size];
				} else {
					return null;
				}
			}
		
			this.hasNext = function() {
				if(self.tail != i)
					return true;
				else
					return false;
			}
		
			return this
	}
	
	this.size = function() {
		return length;
	}
}