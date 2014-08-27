define([], function(require) {
	var level1physics = require('text!svg/physics.svg'),
		level1art = require('text!svg/foreground.svg'),
		SVG_DIVIDER = 10,
		physics;
	require('box2d');
	
	var Level = function () {

	};

	/*
	* parse polygon
	*/
    function parsePolygon(poly) {
        var points = poly.attr('points'),
        	pointarray = points.split(' '),
        	objarray = [],
        	vectorarray = [],
        	i, j;

        for (i = 0; i < pointarray.length - 1; i += 1) {
            var point = pointarray[i].split(',');
            objarray[i] = {x: point[0], y: point[1]};
        }

        for (j = 0; j < pointarray.length - 1; j += 1) {
            var x = objarray[j].x / SVG_DIVIDER;
            var y = objarray[j].y / SVG_DIVIDER;
            vectorarray[j] = new Box2D.Common.Math.b2Vec2(x, y);
        }

        var fixDef = new Box2D.Dynamics.b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
         
        var bodyDef = new Box2D.Dynamics.b2BodyDef;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        bodyDef.position.x = 0;
        bodyDef.position.y = 0;
        fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsArray(vectorarray);
        physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    /*
    * parse rectangles
    */
    function parseRect(rect, type) {
	
		var body,
            fixDef,
            bodyDef,
            _w = (rect.attr('width') / SVG_DIVIDER) / 2,
			_h = (rect.attr('height') / SVG_DIVIDER) / 2,
			_x = (rect.attr('x') / SVG_DIVIDER) + (rect.attr('width') / SVG_DIVIDER) / 2,
			_y = (rect.attr('y') / SVG_DIVIDER) + (rect.attr('height') / SVG_DIVIDER) / 2;
	
        fixDef = new Box2D.Dynamics.b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox(_w, _h);
   
        bodyDef = new Box2D.Dynamics.b2BodyDef;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        bodyDef.position.x = _x;
        bodyDef.position.y = _y;

		if(type) {
			fixDef.isSensor = true;
		}
        
        body = physics.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        
        if (type) {
            if (type == 'camerasensor') {
                body.SetUserData({id: type, z: rect.attr('data-z')});
            } else {
                body.SetUserData({id: type});
            }
        }
    }
	
	Level.prototype = {
		setWorld: function (p) {
			physics = p;
		},

		addLevel: function () {
			$('body').addClass('level1');
			$('#gameView').append(level1physics);
			$('#gameView').append(level1art);

			d3.select('#svgPhysics').selectAll("polygon").each(function () {
        		parsePolygon(d3.select(this));
        	});

        	d3.select('#svgPhysics').selectAll("rect:not(.spring):not(.goal):not(.camerasensor)").each(function () {
        		parseRect(d3.select(this));
        	});

            d3.select('#svgPhysics').selectAll("rect.camerasensor").each(function () {
                parseRect(d3.select(this), 'camerasensor');
            });

            parseRect(d3.select('.goal'), 'goal');

        	$('#svgPhysics').remove();
		}
	};
	
	return new Level();
});