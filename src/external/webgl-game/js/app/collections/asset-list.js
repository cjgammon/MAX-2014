define([], function (require) {
	var Backbone = require('backbone'),
		Asset = require('app/models/asset');

	var AssetList = Backbone.Collection.extend({
		model: Asset,

		initialize: function () {
			this.loaded = 0;
			this.models = [
				new Asset({id: 0, src: 'assets/models/skier.js'}),
				new Asset({id: 0, src: 'assets/models/yeti.js'})
			];
		},

		load: function (callback) {
			this.loadCallback = callback;

			for (var i = 0; i < this.models.length; i += 1) {
				this.models[i].load(this.handle_asset_LOADED.bind(this));
			}
		},

		handle_asset_LOADED: function () {
			this.loaded += 1;

			if (this.loaded == this.models.length) {
				this.loadCallback();
			}
		}
	});
	
	return new AssetList();
});
