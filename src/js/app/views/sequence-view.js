/*global define*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		GameView;
		
	GameView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
			
			if (view == this) {	
				this.step = 0;
				this.active = true;
				this.iframe = $('<iframe>');
				view.$el.append(this.iframe);
				this.iframe.attr('src', view.$el.data('src'));

				AppEvent.trigger('stopanimation');
			}
		},
		
		desolve: function () {
			if (this.active) {
				this.active = false;
				this.iframe.remove();
				AppEvent.trigger('startanimation');
			}
		},

        trigger: function () {
            this.step += 1;
            
            if (this.step < this.iframe[0].contentWindow.stepcount) {
                this.iframe[0].contentWindow.trigger();
            } else {
		        AppEvent.trigger('next');
            }
        }
		
	});
	
	return GameView;
});

