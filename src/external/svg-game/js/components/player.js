define([], function(require) {
	var graphic = require('text!svg/character.svg'),
		UserEvent = require('events/UserEvent'),
		SVG_DIVIDER = 10,
		instance,
		Player;
	require('box2d');

	Player = function (physics) {
		instance = this;
		this.init(physics);
		this.physics = physics;
	};
	
	Player.prototype = {
		init: function (physics) {
			this.id = "player";
			this.canjump = false;
			
			this.fixture = new Box2D.Dynamics.b2FixtureDef;
	        this.fixture.density = 0.5;
	        this.fixture.friction = 1.5;
	        this.fixture.restitution = 0.2;
	        this.fixture.shape = new Box2D.Collision.Shapes.b2CircleShape(1.5);

	        this.body = new Box2D.Dynamics.b2BodyDef;
	        this.body.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	        this.body.position.Set(50, 50);
	
	        this.b = physics.world.CreateBody(this.body);
			this.b.SetUserData(this);
	        this.b.CreateFixture(this.fixture);
			
			$('#gameView').append(graphic) //TODO:: add reference outside of here?
			this.graphic = $('#playerSVG');
     		TweenMax.set(this.graphic, {css: {scale: 1}});

			UserEvent.KEY_DOWN.add(this.handle_KEY_DOWN);
		},

		getPosition: function () {
			var pos = this.b.GetPosition(),
				_x = pos.x * SVG_DIVIDER - this.graphic.width() / 2,
				_y = pos.y * SVG_DIVIDER - this.graphic.height() / 2;
			return {x: _x, y: _y};
		},
		
		draw: function () {
			var _angle = this.b.GetAngle() * 180 / Math.PI,
				_x = this.getPosition().x,
				_y = this.getPosition().y;
			
			TweenMax.set(this.graphic, {css:{x: _x, y: _y, rotation: _angle}});
	        //this.graphic.css('-webkit-transform', 'translate(' + _x + 'px, ' + _y + 'px) rotate(' + _angle  + 'deg)');
		},
		
		handle_KEY_DOWN: function (e) {
        	switch (e.keyCode) {
        	case 39:
				if (instance.b.GetAngularVelocity() < 10) {
					//TODO:: reset speed to zero if new direction
					//console.log('<t:', instance.b.GetTorque);
					instance.b.ApplyTorque(700);
				}
            	break;
        	case 37:
				if (instance.b.GetAngularVelocity() > -10) {
					//TODO:: reset speed to zero if new direction
					//console.log('>t:', instance.b.GetTorque);
            		instance.b.ApplyTorque(-700);
				}
            	break;
        	case 38:
				var playeruserdata = instance.b.GetUserData();
            	if (playeruserdata.canjump == true) {
					//use torque to adjust jump direction
            		instance.b.ApplyImpulse(new Box2D.Common.Math.b2Vec2(
            			instance.b.GetAngularVelocity(), -70), 
            			instance.b.GetWorldCenter());
            	}
            	break;
        	}
      	},

      	destroy: function () {
      		this.remove = true;
     		TweenMax.to(this.graphic, 1, {css: {scale: 0}});
      	}
	};
	
	return Player;
});