/*global define $ requestAnimationFrame*/
define([], function (require) {
	
	var App,
		Backbone = require('backbone'), 
		BgView = require('app/views/scene-view'),
		UserEvent = require('app/events/user-event'),
		AssetList = require('app/collections/asset-list');
		
    App = Backbone.View.extend({
        initialize: function () {
			//var assetList = new AssetList(); 		//load all assets
			AssetList.load(this.start.bind(this));
			$(document).bind('keydown', this.keydown);

        },

        start: function () {
        	$('#preloader').hide();

			this.bg = new BgView();
			requestAnimationFrame(this.render.bind(this));
        },

        render: function () {
			this.bg.render();
			requestAnimationFrame(this.render.bind(this));
        },

        keydown: function (e) {
        	UserEvent.trigger('keydown', e);
        }
    });

	return new App();
});
