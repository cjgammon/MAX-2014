define([], function(require) {
	var Camera,
		UserEvent = require('events/UserEvent'),
		GameEvent = require('events/GameEvent'),
		SVG_DIVIDER = 10,
		instance;
	
	Camera = function () {
		instance = this;
		this.x = 0;
		this.y = 0;
		this.z = 1;
		this.i = 0;
		this.delta = {x: 0, y: 0};
		this.dragging = false;
		this.element = $('#gameView');
		this.following = null;

		UserEvent.MOUSE_DOWN.add(this.handle_MOUSE_DOWN);
		UserEvent.MOUSE_MOVE.add(this.handle_MOUSE_MOVE);
		UserEvent.MOUSE_UP.add(this.handle_MOUSE_UP);
		GameEvent.CAMERA_SENSOR.add(this.handle_CAMERA_SENSOR);
	};
	
	Camera.prototype = {
		handle_MOUSE_DOWN: function (e) {
			if (!this.following){
        		instance.delta = {x: e.pageX, y: e.pageY};
        		instance.dragging = true;
        	}
    	},

    	handle_MOUSE_UP: function (e) {
    		instance.dragging = false;
    	},

    	handle_MOUSE_MOVE: function (e) {

    		if (instance.dragging) {
    			instance.x += instance.delta.x - e.pageX;
        		instance.y += instance.delta.y - e.pageY;

		/*
				//TODO:: multiply by z
        		if (instance.x < 0 || instance.y < 0) {
        			if (instance.x < 0) {
        				instance.x = 0;
        				instance.delta.y = e.pageY;
        			}
        			if (instance.y < 0) {
        				instance.y = 0;
        				instance.delta.x = e.pageX;
        			}
        		} else {
       */
        			instance.delta = {x: e.pageX, y: e.pageY};
        //		}
        		
        		instance.go();
    		}
    	},

    	handle_CAMERA_SENSOR: function (pos) {
    		if (this.z !== pos.z) {
    			instance.animateToPosition(this.x, this.y, pos.z, 1, 0);
    		}
    	},

    	animateToPosition: function (_x, _y, _z, dur, _delay) {
    		TweenMax.to(instance, dur, {
    			x: _x, 
    			y: _y, 
    			z: _z, 
    			delay: _delay,
    			onUpdate: function () {
    				instance.go();
    			}
    		});
    	},

		setPosition: function (_x, _y, _z) {
			this.x = _x;
			this.y = _y;
			this.z = _z;

			this.go();
		},

		follow: function (followme) {
			this.following = followme;
		},

		//updates request animation frame
		update: function () {
			if (this.following) {
				this.x = this.following.getPosition().x - (window.innerWidth / 2) / this.z;
				this.y = this.following.getPosition().y - (window.innerHeight / 2) / this.z;
				this.go();
			}
		},

		//move camera to position
		go: function(){
			console.log(this.x, this.y, this.z);
			this.element.css('webkitTransformOrigin', this.x + 'px ' + this.y + 'px');
			TweenMax.set(this.element, {css: {x: -this.x, y: -this.y, z: 0.1, scale: this.z}});
			/*TweenMax.set(this.element, {css: {x: -this.x, y: -this.y, scale: this.z}});*/
		}
	};
	
	return Camera;
});