define([], function (require) {
	var Backbone = require('backbone');

	var Asset = Backbone.Model.extend({
		initialize: function () {

		},

		load: function (callback) {
			this.loadCallback = callback;

			var loader = new THREE.JSONLoader();
            loader.load(this.get('src'), this.loaded.bind(this));
		},

		loaded: function (geometry, materials) {
			this.set('geometry', geometry);
			this.set('materials', materials);
			this.loadCallback();
		}

	});
	
	return Asset;
});
