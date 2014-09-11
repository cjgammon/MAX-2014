define([], function(require) {
	var contactListener = require('physics/contactlistener');
	require('box2d');
	
	var Physics = function () {
		this.init();
	};
	
	Physics.prototype = {
		init: function () {
			var gravity = new Box2D.Common.Math.b2Vec2(0, 40);
			this.world = new Box2D.Dynamics.b2World(gravity, true);

			this.world.SetContactListener(contactListener);
		},
		
		update: function () {
			this.world.Step(
	               1 / 60   //frame-rate
	            ,  10       //velocity iterations
	            ,  10       //position iterations
	        );
	
			if (this.debugDraw) {
				this.world.DrawDebugData();
			} else {
				var obj = this.world.GetBodyList();

				while (obj) {
			    	var userdata = obj.GetUserData();
			    	try{
						if (userdata.id == "player") {
							userdata.draw();
						}
						if (userdata.remove == true) {
							this.world.DestroyBody(obj);
						}
			    	} catch (e) {}
					
					obj = obj.GetNext();
				}

			}
			
	        this.world.ClearForces();
		},
		
		debug: function () {			
			this.debugDraw = new Box2D.Dynamics.b2DebugDraw();
			this.debugDraw.SetSprite(document.getElementById("debugCanvas").getContext("2d"));
			this.debugDraw.SetDrawScale(10.0);
			this.debugDraw.SetFillAlpha(0.3);
			this.debugDraw.SetLineThickness(1.0);
			this.debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
			this.world.SetDebugDraw(this.debugDraw);
		}
	};
	
	return Physics;
});