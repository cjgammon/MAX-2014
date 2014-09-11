/*global define THREE $ TweenMax*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		Camera = require('pres/models/camera'),
		CoverBg = require('app/views/bg/cover-bg'),
		MeshBg = require('app/views/bg/mesh-bg'),
		EvolutionBg = require('app/views/bg/evolution-bg'),
		TerrainBg = require('app/views/bg/terrain-bg'),
		TestBg = require('app/views/bg/test-bg'),
		isTerrain,
		currentSlide,
		currentBg,
		BG_LIST,
		BgView;
	
	require('three');

	BgView = Backbone.View.extend({

		initialize: function () {
			
			BG_LIST = [
				{id: 'cover', view: CoverBg},
				{id: 'evolution', view: EvolutionBg}
			];
				
			this.$el = $('#bg');
			this.addRenderer();
						
			UserEvent.on('resize', this.resize, this);
		},
		
		addRenderer: function () {
			this.renderer = new THREE.WebGLRenderer({canvas: this.$el[0], antialias: true});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setClearColor(0x000000);		
		},
		
		render: function () {
			var currentView,
				slide;
			
			if (currentSlide !== Vars.get('currentSlide')) {
				slide = Vars.get('slides').at(Vars.get('currentSlide'));
				
				//check if Terrain
				if (typeof(slide.get('view').$el.data('pos')) !== 'undefined') {
					this.handleTerrainSlide();
				} else {
					this.handleNormalSlide();
				}
			}
		
			if (currentBg) {
				currentBg.render();
			}		
		},

		handleTerrainSlide: function () {
			if (!isTerrain) {
				if (typeof(currentSlide) !== 'undefined' && currentBg) {
					currentBg.destroy();
				}

				currentSlide = Vars.get('currentSlide');

				currentBg = null;
				currentBg = new TerrainBg();
				currentBg.init(this.renderer);
				isTerrain = true;
			}

			return;
		},
		
		handleNormalSlide: function () {
			var slide = slide = Vars.get('slides').at(Vars.get('currentSlide'));
			
			if (typeof(currentSlide) !== 'undefined' && currentBg) {
				currentBg.destroy();
			}
			
			currentSlide = Vars.get('currentSlide');
			currentView = this.getCurrentView(slide);
			
			if (currentView) {
				currentBg = null;
				currentBg = new currentView();
				currentBg.init(this.renderer);
			} else {
				currentBg = null;
			}
			
			isTerrain = false;
		},

		getCurrentView: function (slide) {
			var i;
			
			for (i = 0; i < BG_LIST.length; i += 1) {
				if (BG_LIST[i].id == slide.get('name')) {
					return BG_LIST[i].view;
				} else if (slide.get('view').$el.data('color')) {
					return MeshBg;
				}
			}
		},

		resize: function () {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	});
		
	return BgView;
});
