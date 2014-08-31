var tl = new TimelineMax(),
win = $(window);

var sequences = [

	{el: $('#title-svg-b1'), from:{y: -500}, to:{y: 0}, ease: Quad.easeOut, start: 0.4, end: 1.2},
	{el: $('#title-svg-b2'), from:{y: 300}, to:{y: 0}, ease: Quad.easeOut, start: 0.4, end: 1.2},
	{el: $('#title-svg-b3'), from:{y: -500}, to:{y: 0}, ease: Sine.easeInOut, start: 0.5, end: 1},
	{el: $('#title-svg-b4'), from:{y: 290}, to:{y: 1}, ease: Sine.easeInOut, start: 0.5, end: 1},

	{el: $('#title-svg-lines'), from:{x: 0}, to:{x: -100}, ease: Linear.easeNone, start: 0, end: 2},

	{el: $('#section-1 .subtitle-mask'), to:{opacity: 0}, ease: Quint.easeIn, start: 0.2, end: 1},
	{el: $('#section-1 .subtitle-holder hr:nth-child(1)'), from:{scaleX: 1}, to:{scaleX: 0, z: 0.1}, ease: Quint.easeIn, start: 0.2, end: 1.6},
	{el: $('#section-1 .subtitle-holder hr:nth-child(3)'), from:{scaleX: 1}, to:{scaleX: 0, z: 0.1}, ease: Quint.easeIn, start: 0.2, end: 1.6},

	{el: $("#section-2 figcaption"), from:{y: -100, z: -100, rotationX: -50, opacity: 0}, to:{y: -20, z: 0.1, rotationX: 30, opacity: 1}, ease: Circ.easeOut, start: 7.5, end: 8.5},
	{el: $("#section-2 figcaption"), to:{y: -42, z: 10, rotationX: 0}, ease: Sine.easeIn, start: 8.5, end: 8.7},
	{el: $("#section-2 figcaption div"), from:{y: 100, z: 0.1}, to:{y: 0, z: 0.1}, ease: Sine.easeIn, start: 7.7, end: 8.7},
	{el: $("#section-2 figcaption div"), from:{x: -20, z: 0.1}, to:{x: 0, z: 0.1}, ease: Circ.easeInOut, start: 8.4, end: 9},
	
	{el: $("#section-2 .quote-svg"), from:{rotationX: 90}, to:{rotationX: 0, z: 0.1}, ease: Circ.easeInOut, start: 10, end: 12},
	{el: $("#section-2 .quote-svg .quote-svg-ellipse-1"), from:{y: -50}, to:{y: 0}, ease: Quint.easeOut, start: 10.5, end: 14},
	{el: $("#section-2 .quote-svg .quote-svg-ellipse-2"), from:{y: 50}, to:{y: 0, x: 100}, ease: Quad.easeOut, start: 10.5, end: 14},
	{el: $("#section-2 blockquote"), from:{y: 100, opacity: 0}, to:{y: 0, opacity: 1, z: 0.1}, ease: Quad.easeOut, start: 11.5, end: 12.5},
	{el: $("#section-2 blockquote"), from:{x: -100}, to:{x: 0, z: 0.1}, ease: Quint.easeIn, start: 11, end: 13},
	
	{el: $("#section-3 blockquote"), from:{x: -800}, to:{x: 0, z: 0.1}, ease: Circ.easeOut, start: 19.5, end: 20.5},
	{el: $("#section-3 blockquote div"), from:{scaleX: 0.4, opacity: 0}, to:{scaleX: 1, opacity: 1, z: 0.1}, ease: Sine.easeInOut, start: 19.5, end: 21},
	{el: $("#section-3 blockquote .quote-icon"), from:{x: ($("#section-3 blockquote").width() / 2) - 162, y: $("#section-3 blockquote div").position().top + $("#section-3 blockquote div").height() + 100, scaleX: 0.5, scaleY: 2, opacity: 0}, to:{x: ($("#section-3 blockquote").width() / 2) - 62, scaleX: 2, scaleY: 2, opacity: 1, z: 0.1}, ease: Sine.easeInOut, start: 19.5, end: 21},

	{el: $("#section-4 figcaption"), from:{y: -100, z: -100, rotationX: -50, opacity: 0}, to:{y: -20, z: 0.1, rotationX: 30, opacity: 1}, ease: Circ.easeOut, start: 31.5, end: 32.5},
	{el: $("#section-4 figcaption"), to:{y: -42, z: 10, rotationX: 0}, ease: Sine.easeIn, start: 32.5, end: 32.7},
	{el: $("#section-4 figcaption div"), from:{y: 100, z: 0.1}, to:{y: 0, z: 0.1}, ease: Sine.easeIn, start: 31.7, end: 32.7},
	{el: $("#section-4 figcaption div"), from:{x: -20, z: 0.1}, to:{x: 0, z: 0.1}, ease: Circ.easeInOut, start: 32.4, end: 33},


	{el: $("#section-4 ul li:nth-child(1)"), to:{className: "large"}, ease: Elastic.easeOut, start: 41, end: 42},
	{el: $("#section-4 ul li:nth-child(2)"), to:{className: "large"}, ease: Elastic.easeOut, start: 41.2, end: 42.2},
	{el: $("#section-4 ul li:nth-child(3)"), to:{className: "large"}, ease: Elastic.easeOut, start: 41.4, end: 42.4},

	{el: $("#section-4 ol li:nth-child(1)"), to:{className: "large"}, ease: Elastic.easeOut, start: 43, end: 44},
	{el: $("#section-4 ol li:nth-child(2)"), to:{className: "large"}, ease: Elastic.easeOut, start: 43.2, end: 44.2},
	{el: $("#section-4 ol li:nth-child(3)"), to:{className: "large"}, ease: Elastic.easeOut, start: 43.4, end: 44.4},

    {el: $('#section-10 .section-gallery'), from:{position:'absolute'}, to:{position:'fixed'}, start:$('#section-10')},
    {el: $('#section-10 .section-gallery'), to:{position:'absolute', top:'auto', bottom:0}, start:$('#section-11'), match:'bottom'},


	{el: $("#section-11 figcaption"), from:{y: -100, z: -100, rotationX: -50, opacity: 0}, to:{y: -20, z: 0.1, rotationX: 30, opacity: 1}, ease: Circ.easeOut, start: 120.5, end: 121.5},
	{el: $("#section-11 figcaption"), to:{y: -42, z: 10, rotationX: 0}, ease: Sine.easeIn, start: 121.5, end: 121.7},
	{el: $("#section-11 figcaption div"), from:{y: 100, z: 0.1}, to:{y: 0, z: 0.1}, ease: Sine.easeIn, start: 120.7, end: 121.7},
	{el: $("#section-11 figcaption div"), from:{x: -20, z: 0.1}, to:{x: 0, z: 0.1}, ease: Circ.easeInOut, start: 121.4, end: 122},
];


var i, el, o, tw, end, start, delayqueue = [], ease, yoyo, repeat, motiontw;

// Adding to timeline
for (i = 0; i < sequences.length; i++) {
    o = sequences[i];
    if (typeof(o.start) != 'number') {
        delayqueue.push(o);
    } else {
        end = (o.end || o.start + 0.01 ) - o.start;
		ease = o.ease || Quad.linear;
		yoyo = o.yoyo || false;
		repeat = o.repeat || 0;
		
        new TweenMax.set(o.el, {css:o.from});
        tw = new TweenMax.to(o.el, end, {css:o.to, ease: ease, yoyo: yoyo, repeat: repeat});
        tl.add(tw, o.start);
    }
}

function delayStart() {
	buildTitle();
	buildSmallTitles();
	addLineTweens();
	addFigureTweens();
}

function UPDATE_CircleTransition() {
	var svg = $('#full-svg-1');
		
	if (svg.offset().top < win.scrollTop() + win.height()) {
		if (!svg.parent().hasClass('in')) {
			svg.parent().addClass('in');
			
			new TweenMax.fromTo($('#full-svg-1-circle-1'), .3, {opacity: 0, scale: 0.5, x: 500, y: 400, z: 0.1}, {opacity: 1, scale: 1, z: 0.1, ease: Quad.easeOut, yoyo: true, repeat: 1});
			new TweenMax.fromTo($('#full-svg-1-circle-2'), .3, {opacity: 0, scale: 0.5, x: 500, y: 400, z: 0.1}, {opacity: 1, scale: 1, z: 0.1, ease: Quad.easeOut, yoyo: true, repeat: 1, delay: 0.8});
			new TweenMax.fromTo($('#full-svg-1-circle-3'), .3, {opacity: 0, scale: 0.5, x: 500, y: 400, z: 0.1}, {opacity: 1, scale: 1, z: 0.1, ease: Quad.easeOut, yoyo: true, repeat: 1, delay: 1});
			new TweenMax.fromTo($('#full-svg-1-circle-4'), .4, {opacity: 0, x: 500, y: 400, z: 0.1}, {opacity: 1, z: 0.1, ease: Quad.easeIn, yoyo: true, repeat: 1, delay: 1.5});
			new TweenMax.fromTo($('#full-svg-1-circle-4'), .8, {rotation: 0, scale: 0.5}, {rotation: 90, scale: 3, ease: Linear.easeNone, delay: 1.5});
			new TweenMax.fromTo($('#full-svg-1-circle-5'), .4, {opacity: 0, x: 500, y: 400, z: 0.1}, {opacity: 1, z: 0.1, ease: Quad.easeIn, yoyo: true, repeat: 1, delay: 1.7});
			new TweenMax.fromTo($('#full-svg-1-circle-5'), 1, {rotation: 0}, {rotation: 90, ease: Linear.easeNone, delay: 1.7});
			new TweenMax.fromTo($('#full-svg-1-circle-5'), .8, {scale: 0.5}, {scale: 2, ease: Linear.easeNone, delay: 1.7});
			
			new TweenMax.fromTo($('#full-svg-1-circle-6'), .4, {opacity: 0, x: 500, y: 400, z: 0.1}, {opacity: 1, z: 0.1, ease: Quad.easeIn, yoyo: true, repeat: 1, delay: 2});
			new TweenMax.fromTo($('#full-svg-1-circle-6'), 1, {rotation: 0}, {rotation: 200, ease: Linear.easeNone, delay: 2});
			new TweenMax.fromTo($('#full-svg-1-circle-6'), .8, {scale: 0.7}, {scale: 2, ease: Linear.easeNone, delay: 2});
				
			new TweenMax.fromTo($('#full-svg-1-circle-7'), .75, {opacity: 0, x: 500, y: 400, z: 0.1}, {opacity: 1, z: 0.1, ease: Quad.easeInOut, yoyo: true, repeat: 1, delay: 1.5});
			new TweenMax.fromTo($('#full-svg-1-circle-7'), 1.5, {rotation: 0}, {rotation: 360, ease: Linear.easeNone, delay: 1.5});
			new TweenMax.fromTo($('#full-svg-1-circle-7'), 1.5, {scale: 0.1}, {scale: 4, ease: Quad.easeInOut, delay: 1.5});
					
			new TweenMax.fromTo($('#full-svg-1 #circleMask .circle-group'), 2.5, {opacity: 1, scale: 0, x: 500, y: 400, z: 0.1}, {opacity: 1, scale: 10, z: 0.1, ease: Quad.easeInOut, delay: 1.4});
			
		}
	} else if (svg.offset().top > win.scrollTop() + win.height()){
		if (svg.parent().hasClass('in')) {
			svg.parent().removeClass('in');
			new TweenMax.set($('#full-svg-1 #circleMask .circle-group'), {opacity: 0});
		}
	}
}

function addFigureTweens() {
	var figures = $('figure svg'),
		g,
		s,
		str,
		white,
		border,
		matrix,
		matrix2,
		i;
	
	for (i = 0; i < figures.length; i += 1) {
		s = Snap('#' + figures[i].id);
		g = s.select('.figure-svg-g');
		str = Snap.parsePathString("M330,220c-60-40-300-40-360,0c60-40,60-200,0-240c60,40,300,40,360,0C270,20,270,180,330,220z");
		
		matrix = new Snap.Matrix();
		matrix.translate(25, 25);
		matrix.scale(0.0, 0.0, 150, 100);
		matrix.rotate(20, 150, 100);
		
		burst = s.path(str);
		burst.attr({
			class: 'burst',
			fill: 'white'
		});
		burst.transform(matrix.toTransformString());	
		
		border = s.path(str);
		border.attr({
			class: "stroke",
			fill: "transparent",
			strokeWidth: 8,
			strokeLinejoin: "miter",
			opacity: 0.5
		});
		border.transform(matrix.toTransformString());
		s.prepend(border);
		
		white = s.rect(0, 0, 350, 250);
		white.attr({
			class: 'shading',
			fill: 'white'
		});
		
		g.add(white);
		g.attr({
			mask: burst
		});	
	}
}

function resetFigure(burst, stroke) {
	var matrix,
		str = Snap.parsePathString("M330,220c-60-40-300-40-360,0c60-40,60-200,0-240c60,40,300,40,360,0C270,20,270,180,330,220z");
	
	matrix = new Snap.Matrix();
	matrix.translate(25, 25);
	matrix.scale(0.0, 0.0, 150, 100);
	matrix.rotate(20, 150, 100);
	
	burst.attr({"d": str});
	burst.transform(matrix.toTransformString());	
	stroke.attr({"d": str, strokeWidth: 8, opacity: 0.5});
	stroke.transform(matrix.toTransformString());			
}

function UPDATE_Figures() {
	var figures = $('figure svg'),
		figure,
		s,
		burst,
		white,
		stroke,
		i;
	
	for (i = 0; i < figures.length; i += 1) {
		figure = $(figures[i]);
		s = Snap('#' + figures[i].id);
		burst = s.select(".burst");
		white = s.select(".shading")
		stroke = s.select(".stroke")
		
		if (!burst && !white) {
			return;
		}
		
		if (figure.offset().top + figure.height() < win.scrollTop() + win.height()) {
			if (!burst.hasClass('in')) {
				burst.addClass('in');
				white.animate({opacity: 0}, 400);
				triggerFigureAnimation(burst, stroke);
			}
		} else if (figure.offset().top > win.scrollTop() + win.height()){
			if (burst.hasClass('in')) {
				resetFigure(burst, stroke);
				white.attr({opacity: 1});
				burst.removeClass('in');
			}
		}
	}
}

function triggerFigureAnimation(burst, stroke) {
	var str2,
		str3,
		matrix2,
		matrix3;
		
	str2 = Snap.parsePathString("M300,200c-100,12.7-200,12.7-300,0C-19,133.3-19,66.7,0,0c100-12.7,200-12.7,300,0C319,66.7,319,133.3,300,200z");
	str3 = Snap.parsePathString("M300,200c-101.7,0-199,0-300,0C0,131,0,68.3,0,0c101.7,0,199,0,300,0C300,65.7,300,133.7,300,200z");
	
	matrix2 = new Snap.Matrix();
	matrix2.translate(25, 25);
	matrix2.scale(1.1, 1.1, 150, 100);
	matrix2.rotate(-3, 150, 100);
	
	matrix3 = new Snap.Matrix();
	matrix3.translate(25, 25);
	matrix3.scale(1, 1, 150, 100);
	matrix3.rotate(0, 150, 100);
	
	function handle_COMPLETE() {
		stroke.animate({"d": str3, transform: matrix3.toTransformString(), strokeWidth: 0, opacity: 0}, 200, mina.easeIn);
		burst.animate({"d": str3, transform: matrix3.toTransformString()}, 200, mina.easeIn);
	}

	stroke.animate({"d": str2, transform: matrix2.toTransformString()}, 400, mina.easeOut);
	burst.animate({"d": str2, transform: matrix2.toTransformString()}, 400, mina.easeOut, handle_COMPLETE);
}

function buildTitle() {
	var title = $('#section-1 .title').first();

	wrapLetters(title);
	addTitleTween();
}

function addTitleTween(title) {
	var letters = $('#section-1 .letter'),
		letter,
		start,
		tw,
		i;
		
	for (i = 0; i < letters.length; i += 1) {
		letter = $(letters[i]);
		start = 0.3 + Math.sin(i) * 0.1;
		
		tw = new TweenMax.fromTo(letter, 0.01, {css:{opacity: 1}}, {css:{opacity: 0}});
		tl.add(tw, start);
	}
}

function addLineTweens() {
	var lines = $('.title-svg-line'),
		line,
		start,
		tw,
		i;
	
	for (i = 0; i < lines.length; i += 1) {
		line = $(lines[i]);
		start = 0.0 + Math.sin(i) * 0.2;
		
		tw = new TweenMax.fromTo(line, 0.1, {css:{opacity: 0}}, {css:{opacity: 1}, yoyo: true, repeat: 1});
		tl.add(tw, start);
	}
}

function buildSmallTitles() {
	var titles = $('.title-small'),
		i;
	
	for (i = 0; i < titles.length; i += 1) {
		wrapLetters(titles[i]);
		addSmallTitleTween(titles[i]);
	}
}

function addSmallTitleTween(title) {
	var $title = $(title),
		letters = $title.find('.letter'),
		letter,
		start,
		tw,
		i;
	
	for (i = 0; i < letters.length; i += 1) {
		letter = $(letters[i]);
		start = (($title.offset().top - $(window).height()) / 100) + (i * 0.02);

		tw = new TweenMax.fromTo(letter, 1, {css:{opacity: 0, rotationX: 90, z: 0.1}}, {css:{opacity: 1, rotationX: 0, z: 0.1}});
		tl.add(tw, start);
		
		tw = new TweenMax.to(letter, 1, {css:{skewX: -10}, delay: 0.15, ease: Quad.easeIn});
		tl.add(tw, start);
	}
}

function wrapLetters(title) {
	var t = $(title),
		string = t.html(),
		html = '',
		i;

	for (i = 0; i < string.length; i += 1) {
		html += '<span class="letter">';
		if (string.charAt(i) !== " ") {
			html += string.charAt(i);
		} else {
			html += "&nbsp;";
		}
		html += '</span>';
	}
	
	t.html(html);
}

$().ready(function() {

    // Delay adding certain elements to timeline elements that required accurate position calculation
    setTimeout(delayStart, 100);
});

tl.pause();
tl.seek(0);

win.scroll(function (e) {
	var time = win.scrollTop() / 100;
	
	console.log(time);
	if (time < 0) time = 0;
	
	UPDATE_Figures();
	UPDATE_CircleTransition();
    tl.seek(time)
});
