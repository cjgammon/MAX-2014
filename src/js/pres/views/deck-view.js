/*global define TimelineMax TweenMax $ Quad THREE*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		CameraPath = require('app/models/camera-path'),
		Camera = require('pres/models/camera'),
		DeckView; 
		
	require('tweenmax');
	require('three');
	require('vendor/CSS3DRenderer');
	
	DeckView = Backbone.View.extend({
		
		initialize: function () {
			this.$el = $('#deck');	
		},
		
		render: function () {

		},
		
		resolve: function () {
			AppEvent.trigger('resolve');
		},
		
		desolve: function () {
			AppEvent.trigger('desolve');	
		},
		
		setCamera: function (camera) {
			this._camera = camera;
		},

		getSlides: function () {
			return this._slides;
		},

		setSlides: function () {
			var slides = Vars.get('slides'),
				slideElement,
				view,
				pos,
				pathLength,	
				point,
				i;
			
			this._slides = slides;
		},
		
		resize: function () {

		}
	});
	
	return DeckView;
});
