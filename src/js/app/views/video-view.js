/*global define*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		VideoView;
		
	VideoView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
			
			if (view == this) {	
				this.active = true;
								
				this.video = $('<video>');
				this.video[0].src = view.$el.data('video');
				this.video[0].volume = 0;
				this.video[0].loop = true;
				this.video[0].addEventListener('loadedmetadata', function () {
					this.resize();
					this.video[0].play();
				}.bind(this));
				view.$el.prepend(this.video);
				
				UserEvent.on('resize', this.resize.bind(this));
				
				AppEvent.trigger('stopanimation');
			}
		},
		
		resize: function () {			
			var _height,
				_width,
				_left,
				_top;
			
			
			_height = window.innerHeight;
			_width = this.video[0].videoWidth * (window.innerHeight / this.video[0].videoHeight);
			_left = (window.innerWidth / 2) - (_width / 2);
			_top = 0;
			
			if (_width < window.innerWidth) {
				_height = this.video[0].videoHeight * (window.innerWidth / this.video[0].videoWidth);
				_width = window.innerWidth;
				_left = (window.innerWidth / 2) - (_width / 2);
				_top = (window.innerHeight / 2) - (_height / 2);
			}
					
			this.video[0].style.top = _top + 'px';
			this.video[0].style.left = _left + 'px';
			this.video[0].style.width = _width + 'px';
			this.video[0].style.height = _height + 'px';
		},
		
		desolve: function () {
			if (this.active) {
				this.active = false;
				this.video[0].pause();
				this.video[0].src = "about:blank";
				this.video.remove();
				
				UserEvent.off('resize', this.resize.bind(this));
				AppEvent.trigger('startanimation');
			}
		}
		
	});
	
	return VideoView;
});

