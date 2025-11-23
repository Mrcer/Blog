function createCpx(real, img) {
	return new ComplexNumber(real, img)
}

function ComplexNumber(real, img) {
	this.real = real
	this.img = img
}

ComplexNumber.prototype = {
	constructor : ComplexNumber,
	copy : function() {
		return createCpx(this.real, this.img)
	},
	add : function(cpx) {
		this.real += cpx.real
		this.img += cpx.img
		return this
	},
	sub : function(cpx) {
		this.real -= cpx.real
		this.img -= cpx.img
		return this
	},
	mult : function(n) {
		if(n.constructor.name == "ComplexNumber") {
			real = this.real
			img = this.img
			nreal = n.real
			nimg = n.img
			this.real = real * nreal - img * nimg
			this.img = img * nreal + real * nimg
		} else {
			this.real *= n
			this.img *= n
		}
		return this
	},
	div : function(n) {
		if(n.constructor.name == "ComplexNumber") {
			temp = sq(n.real) + sq(n.img)
			real = this.real
			img = this.img
			nreal = n.real
			nimg = n.img
			this.real = (real * nreal + img * nimg) / temp
			this.img = (img * nreal - real * nimg) / temp
		} else {
			this.real /= n
			this.img /= n
		}
		return this
	},
	mag : function() {
		return sqrt(sq(this.real)+sq(this.img))
	}
}
