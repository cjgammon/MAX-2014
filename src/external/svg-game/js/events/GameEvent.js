define([], function(require) {
	
	var GameEvent = {
		WIN_LEVEL: new signals.Signal(),
		CAMERA_SENSOR: new signals.Signal(),
		RESTART: new signals.Signal()
	}
	
	return GameEvent;
});