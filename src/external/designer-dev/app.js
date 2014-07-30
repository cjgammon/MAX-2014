var initted = false;


function App() {
	var instance = this,
		s,
		c1,
		c2,
		c3,
		line1,
		line2,
		circles = [],
		big = [
			{name: "DESIGN", x: (window.innerWidth / 3), y: window.innerHeight / 2},
			{name: "DEVELOPMENT", x: (window.innerWidth / 3) * 2, y: window.innerHeight / 2}
		],
		little = [
			{name: 'ILLUSTRATION', color: '#E96166', big: 0},
			{name: 'MOTION GRAPHICS', color: '#E9A261', big: 0},
			{name: 'INFO GRAPHICS', color: '#E9A261', big: 0},
			{name: 'LAYOUT DESIGN', color: '#E96166', big: 0},
			{name: 'TYPOGRAPHY', color: '#E96166', big: 0},
			{name: 'UI DESIGN', color: '#E9A261', big: 0},
			{name: 'STORY BOARDING', color: '#E96166', big: 0},
			{name: 'WIRE FRAMING', color: '#E96166', big: 0},
			{name: 'CONCEPTING', color: '#E96166', big: 0},

			{name: 'PHP', color: '#6FC148', big: 1},
			{name: 'Javascript', color: '#97C148', big: 1},
			{name: 'CSS', color: '#97C148', big: 1},
			{name: 'Objective C', color: '#6FC148', big: 1},
			{name: 'Java', color: '#6FC148', big: 1},
			{name: 'Ruby', color: '#6FC148', big: 1},
			{name: 'Git', color: '#97C148', big: 1}
		];

	function animIn() {
			console.log('animin');
			c1.animIn();
			c2.animIn();
			
			line1 = s.path('M' + (window.innerWidth / 2) + ',' + 0  + 'L' + (window.innerWidth / 2) + ',' + 0);
			line1.animate({'d': 'M' + (window.innerWidth / 2) + ',' + 0  + 'L' + (window.innerWidth / 2) + ',' + ((window.innerHeight / 2) - 9)}, 300);
			
			line2 = s.path('M' + (window.innerWidth / 2) + ',' + window.innerHeight  + 'L' + (window.innerWidth / 2) + ',' + window.innerHeight);
			line2.animate({'d': 'M' + (window.innerWidth / 2) + ',' + window.innerHeight / 2  + 'L' + (window.innerWidth / 2) + ',' + window.innerHeight}, 300);
			
			line1.attr({'stroke': '#333', 'stroke-width': 3, strokeDasharray: "9 9", strokeDashOffset: "988.01"});
			line2.attr({'stroke': '#333', 'stroke-width': 3, strokeDasharray: "9 9", strokeDashOffset: "988.01"});

	}

	function animOut() {
			line1.animate({'d': 'M' + (window.innerWidth / 2) + ',' + 0  + 'L' + (window.innerWidth / 2) + ',' + 0}, 300, mina.easeout);
			line2.animate({'d': 'M' + (window.innerWidth / 2) + ',' + window.innerHeight  + 'L' + (window.innerWidth / 2) + ',' + window.innerHeight}, 300, mina.easeout);

			c1.animOut();
			c2.animOut();

			c3 = s.circle(window.innerWidth / 2, window.innerHeight / 2, 0);
			c3.attr({fill: '#FBFCC2', opacity: 0.8});
			c3.animate({r: 400}, 400, mina.easeout);
	}

	function particlesIn() {
			for (var i = 0; i < little.length; i += 1) {
				var b = little[i].big;
				
				circles[i] = new LittleCircle(s, big[b].x, big[b].y, little[i].name, little[i].color);
				circles[i].animIn();
			}
	}

	function jiggleParitlces() {
			setInterval(instance.loop, 60 / 1000);
	}

	this.init = function () {
		console.log('init', initted);

		if (initted !== false) {
			return;
		}

		initted = true;
		s = Snap(window.innerWidth, window.innerHeight);

		c1 = new BigCircle(s, big[0].x, big[0].y, big[0].name, '#FCC032');
		c2 = new BigCircle(s, big[1].x, big[1].y, big[1].name, '#48C1AC');

		document.addEventListener('click', this.trigger);

		setTimeout(animIn, 100);
	}

	this.trigger = function () {
		document.removeEventListener('click');

		animOut()
		setTimeout(particlesIn, 100);
		setTimeout(jiggleParitlces, 650);
	}

	function distance(p1, p2) {
		var distance,
			dx, 
			dy;

		dx = p2.x - p1.x,
 		dy = p2.y - p1.y;
		distance = Math.sqrt(dx * dx + dy * dy);

		return distance;
	}

	function spring(p1, p2) {
		var dist,
			dx,
			dy,
			ax,
			ay,
			springAmount = 0.001; 

		dx = p2.x - p1.x,
 		dy = p2.y - p1.y;
		dist = distance(p1, p2);

		if (dist < 30) {
			ax = dx * springAmount;
			ay = dy * springAmount;

			p1.vx += ax;
			p1.vy += ay;
			p2.vx -= ax;
			p2.vy -= ay;
		}
	}

	this.loop = function () {
		var i,
			j,
			d,
			center = {x: window.innerWidth / 2, y: window.innerHeight / 2};

		for (i = 0; i < circles.length; i += 1) {
			circles[i].x += circles[i].vx;
			circles[i].y += circles[i].vy;
			
			//if greater than radius bounce
			d = distance(circles[i], center);

			
			if (d > window.innerWidth / 4) {
				circles[i].vx *= -1;
				circles[i].vy *= -1;
			}
			

			for (j = 0; j < circles.length; j += 1) {
				spring(circles[i], circles[j]);
			}	
					
			circles[i].transform();
		}

		//requestAnimationFrame(instance.loop);
	}
}

var app = new App();
app.init();


function trigger() {
	app.trigger();
}