define([], function(require) {
	var Physics = require('physics/world'),
	Player = require('components/player'),
	Star = require('components/star'),
	Camera = require('components/camera'),
	StartPanel = require('components/panel_start'),
	CompletePanel = require('components/panel_complete'),
	LevelModel = require('level'),
	UserEvent = require('events/UserEvent'),
	GameEvent = require('events/GameEvent'),
	instance,
	App;
			
	App = function () {
		instance = this;
	}
	
	App.prototype = {
		init: function () {
			//start app
			
			this.physics = new Physics();
			//this.physics.debug();
			
			LevelModel.setWorld(this.physics);
			LevelModel.addLevel();

			this.player = new Player(this.physics);
			this.camera = new Camera();

			this.camera.follow(this.player);
			console.log('yp')
			
			TweenMax.to(this.camera, 1, {z: 2, delay: 1});
			
			
			this.startpanel = new StartPanel();

			this.addEvents();
			this.update = this.update.bind(this);
			requestAnimationFrame(this.update);

			this.winLevel = this.winLevel.bind(this);
			this.restart = this.restart.bind(this);

			GameEvent.WIN_LEVEL.add(this.winLevel);
			GameEvent.RESTART.add(this.restart);
		},

		restart: function () {
			console.log('restart');
			this.player = null;
			this.player = new Player(this.physics);
			this.camera.follow(this.player);
		},
		
		update: function () {
			this.physics.update();
			this.player.draw();
			this.camera.update();
			requestAnimationFrame(this.update);
		},

		winLevel: function () {
			var i = 0,
				star;

			this.player.destroy();

			for (i; i < 5; i += 1) {
				star = new Star(this.player.getPosition().x, this.player.getPosition().y);
				star.explode();
			}
			
			setTimeout(function () {
				//popup
				this.completepanel = new CompletePanel();
			}, 1000);
		},
		
		addEvents: function () {
			document.addEventListener('keydown', function (e) {
				UserEvent.KEY_DOWN.dispatch(e);
			});
	        document.addEventListener('mousedown', function (e) {
				UserEvent.MOUSE_DOWN.dispatch(e)
			});
	        document.addEventListener('mouseup', function (e) {
				UserEvent.MOUSE_UP.dispatch(e);
			});
			document.addEventListener('mousemove', function (e) {
				UserEvent.MOUSE_MOVE.dispatch(e);
			});
	        window.addEventListener("devicemotion", function (e) {
				UserEvent.DEVICE_MOTION.dispatch(e);
			});
	        window.addEventListener("deviceorientation", function (e) {
				UserEvent.DEVICE_ORIENTATION.dispatch(e);
			});
	        document.addEventListener('touchstart', function (e) {
				UserEvent.TOUCH_START.dispatch(e);
			});
	        document.addEventListener('touchend', function (e) {
				UserEvent.TOUCH_END.dispatch(e);
			});
		}
	}
	
	return new App();
});