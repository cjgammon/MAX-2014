define([], function(require) {
	var CompletePanel,
		svg = require('text!svg/title.svg'),
		GameEvent = require('events/GameEvent'),
		UserEvent = require('events/UserEvent');
	
	CompletePanel = function () {
		this.container = $('<div class="panel">');
		this.container.append(svg);

		$('body').append(this.container);
		$('.panel-copy').text('New levels coming soon!');

		setTimeout(function () {
			$('.titleContent').addClass('in');
		}, 100);

		this.close = this.close.bind(this);
		$('#playBtn').bind('click', this.close);
	};
	
	CompletePanel.prototype = {
		close: function (e) {
			e.preventDefault();
			this.container.remove();
			GameEvent.RESTART.dispatch();
		}
	};
	
	return CompletePanel;
});