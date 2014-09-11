define([], function(require) {
	var ContactListener,
		GameEvent = require('events/GameEvent');
	require('box2d');
	
	var ContactListener = new Box2D.Dynamics.b2ContactListener;

	function beginContactHandler(fixture) {
		var _userdata = fixture.m_body.GetUserData();

		if (_userdata) {
			if (_userdata.id == 'player') {
				_userdata.canjump = true;  //TODO:: not in begin contact but during contact?
			}
		}
	}

	ContactListener.BeginContact = function(contact, manifold) {
		beginContactHandler(contact.m_fixtureA);
		beginContactHandler(contact.m_fixtureB);

		var _userdataA = contact.m_fixtureA.m_body.GetUserData(),
			_userdataB = contact.m_fixtureB.m_body.GetUserData(),
			_z;

		if (_userdataA && _userdataB) {
			if (_userdataA.id == "player" && _userdataB.id == "goal" ||
				_userdataB.id == "player" && _userdataA.id == "goal") {
				GameEvent.WIN_LEVEL.dispatch();
			}

			if (_userdataA.id == "player" && _userdataB.id == "camerasensor") {
				_z = _userdataB.z;
				GameEvent.CAMERA_SENSOR.dispatch({z: _z});
			} else if (_userdataB.id == "player" && _userdataA.id == "camerasensor") {
				_z = _userdataA.z;
				GameEvent.CAMERA_SENSOR.dispatch({z: _z});
			}
		}
	};

	ContactListener.PostSolve = function (contact, manifold) {
		beginContactHandler(contact.m_fixtureA);
		beginContactHandler(contact.m_fixtureB);
	}

	function endContanctHandler(body) {
		var _userdata = body.GetUserData();
		if (_userdata) {
			if (_userdata.id == 'player') {
				_userdata.canjump = false;
			}
		}
	};
	
	ContactListener.EndContact = function (contact, manifold) {
		endContanctHandler(contact.m_fixtureA.m_body);
		endContanctHandler(contact.m_fixtureB.m_body);
	};
		
	return ContactListener;
});