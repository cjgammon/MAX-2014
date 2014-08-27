define([], function(require) {
	var StartPanel,
		svg = require('text!svg/title.svg'),
		UserEvent = require('events/UserEvent');
	
	StartPanel = function () {
		this.container = $('<div class="panel">');
		this.container.append(svg);

		$('body').append(this.container);

		setTimeout(function () {
			$('.titleContent').addClass('in');
		}, 100);

		this.close = this.close.bind(this);
		$('#playBtn').bind('click', this.close);
	};
	
	StartPanel.prototype = {
		close: function (e) {
			e.preventDefault();
			this.container.remove();
		}
	};
	
	return StartPanel;
});