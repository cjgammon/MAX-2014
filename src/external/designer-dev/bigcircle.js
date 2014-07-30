var BigCircle = function(_s, _x, _y, _name, _color) {
	var instance = this;

	this.init = function () {

		this.m = new Snap.Matrix();
		this.m.translate(_x, _y);
		this.m.scale(0, 0);

		this.group = _s.g();
		this.group.transform(this.m.toTransformString());

		this.c = _s.circle(0, 0, 10);
		this.c.attr({fill: _color});
		this.group.append(this.c);

		this.text = _s.text(0, 10, _name);
		this.text.attr({'class': 'big-circle', 'text-anchor': 'middle'});
		this.group.append(this.text);
	}

	this.animIn = function () {
		this.m = new Snap.Matrix();
		this.m.translate(_x, _y);
		this.m.scale(1, 1);
		this.group.animate({'transform': this.m.toTransformString()}, 200, mina.easeout);

		this.c.animate({r: window.innerWidth / 7}, 300);
	}

	this.animOut = function () {
		this.m = new Snap.Matrix();
		this.m.translate(_x, _y);
		this.m.scale(0, 0);
		this.group.animate({'transform': this.m.toTransformString()}, 100);
	}

	this.init();
}