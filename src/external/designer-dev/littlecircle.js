var LittleCircle = function(_s, _x, _y, _name, _color) {
	var instance = this;

	this.x = _x;
	this.y = _y;
	this.speed = 2;
	this.vx = Math.random() * this.speed - (this.speed / 2);
	this.vy = Math.random() * this.speed - (this.speed / 2);
	this.scale = 0;
	this.delta = Math.random() * 100;

	this.init = function () {

		this.m = new Snap.Matrix();
		this.m.translate(this.x, this.y);
		this.m.scale(this.scale, this.scale);

		this.group = _s.g();
		this.group.transform(this.m.toTransformString());

		this.c = _s.circle(0, 0, 10);
		this.c.attr({fill: _color, opacity: 0.9});
		this.group.append(this.c);

		this.text = _s.text(0, 5, _name);
		this.text.attr({'class': 'little-circle', 'text-anchor': 'middle'});
		this.group.append(this.text);
	}

	this.animIn = function () {
		this.scale = 1;
		this.x += Math.random() * 100 - 50;
		this.y += Math.random() * 100 - 50;

		this.m = new Snap.Matrix();
		this.m.translate(this.x, this.y);
		this.m.scale(this.scale, this.scale);
		this.group.animate({'transform': this.m.toTransformString()}, 500, mina.easeout);

		this.r = 30 + Math.random() * 30;
		this.c.animate({r: this.r}, 300);
	}

/*
	this.animOut = function () {
		this.m = new Snap.Matrix();
		this.m.translate(this.x, this.y);
		this.m.scale(0, 0);
		this.group.animate({'transform': this.m.toTransformString()}, 100);
	}
*/

	this.transform = function () {
		this.delta += 0.01;

		this.m = new Snap.Matrix();
		this.m.translate(this.x, this.y);
		this.m.scale(this.scale, this.scale);
		this.group.transform(this.m.toTransformString());

		this.c.attr({r: this.r + Math.sin(this.delta) * 20});
	}

	this.init();
}