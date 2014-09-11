define([], function(require) {
	var graphic = require('text!svg/star.svg'),
		Star;
	
	Star = function (_x, _y) {
		this.x = _x;
		this.y = _y;
		this.init();
	};
	
	Star.prototype = {
		init: function () {
			this.graphic = $(graphic);
			$('#gameView').append(this.graphic);
			TweenMax.set(this.graphic, {
				css: {
					x: this.x, 
					y: this.y, 
					scale: 0, 
					opacity: 0
				}
			});
		},

		explode: function () {
			TweenMax.to(this.graphic, .5 + Math.random(), {
				css: {
					x: this.x + (-50 + Math.random() * 100), 
					y: this.y - 10 - Math.random() * 10, 
					scale: .5, 
					opacity: 1
				},
				ease: Linear.easeNone,
				onComplete: this.fade.bind(this)
			});
		},

		fade: function () {
			TweenMax.to(this.graphic, .5 + Math.random(), {
				css: {
					x: '+=' + (-25 + Math.random() * 50), 
					y: this.y - 20 - Math.random() * 20, 
					scale: .5, 
					opacity: 0
				},
				ease: Linear.easeNone,
				onComplete: this.destroy.bind(this)
			});
		},

      	destroy: function () {
      		this.graphic.remove();
      	}
	};
	
	return Star;
});