/*global define $ requestAnimationFrame*/

define(function (require) {
	
	var App,
		Backbone = require('backbone'), 
		BgView = require('app/views/bg-view'),
		NotesView = require('pres/views/notes-view'),
		SlideBlurView = require('app/views/slide-blur-view'),
		SlideBasicView = require('app/views/slide-basic-view'),
		SequenceView = require('app/views/sequence-view'),
		VideoView = require('app/views/video-view'),
		IframeView = require('app/views/iframe-view'),
		IframeFullView = require('app/views/iframe-full-view'),
		UIButtonSVGView = require('app/views/ui-button-svg-view'),
		UIButtonCanvasView = require('app/views/ui-button-canvas-view'),
		UIButtonWebglView = require('app/views/ui-button-webgl-view'),
		UIButtonShaderView = require('app/views/ui-button-shader-view'),
        AppBase = require('pres/views/app-base');

    App = AppBase.extend({
		BASE_VIEW: SlideBasicView,
		
		SLIDEVIEW_LIST: [
			{cl: 'iframe-full', view: IframeFullView},
			{cl: 'iframe', view: IframeView},
			{cl: 'video', view: VideoView},
			{cl: 'sequence', view: SequenceView},
			{id: 'svg', view: UIButtonSVGView},
			{id: 'canvas', view: UIButtonCanvasView},
			{id: 'webgl', view: UIButtonWebglView},
			{id: 'webgl-shader', view: UIButtonShaderView}
		],
	
        initialize: function () {
            if (this.passTest() !== true) {
				return;
			}

            AppBase.prototype.initialize.call(this);

            this.notesView = new NotesView();

			this.bg = new BgView();
			this.render();
        },

		passTest: function () {	
			if (Modernizr.flexbox !== true) {
				return false;
			} else if (Modernizr.touch === true) {
				$('video').each(function () {
					$(this).attr({
						'src': $(this).data('src')
					});
				});
				return false;
			} else {
				return true;
			}
        },

        render: function () {
	
            AppBase.prototype.render.call(this);

            if (this.bg) {
			    this.bg.render();
            }

        }
    });

	return new App();
});
