/*global define $*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		UserEvent = require('pres/events/user-event'),	
		AppEvent = require('pres/events/app-event'),
		ProgressBar; 
		
	ProgressBar = Backbone.View.extend({
		
		initialize: function () {
			this.$el = $('#progressHolder');
            this.statusBar = $('#progressBar');
            this.percent = 0;
		},
		
		render: function () {									
			var percent = (Vars.get('currentSlide') / (Vars.get('slides').length - 1)) * 100;
            
            if (this.percent !== percent) {
                this.statusBar.width(percent + '%');
                this.percent = percent;
            }
		}
		
	});
	
	return ProgressBar;
});
