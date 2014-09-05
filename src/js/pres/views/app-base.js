/*global define $ requestAnimationFrame TweenMax*/
/**
 * Flexible Presentation Framework
 *
 * By @cjgammon
 * www.cjgammon.com
 */
define(function (require) {
	
	var AppBase,
		Backbone = require('backbone'), 
		AppRouter = require('app-router'), 
		Vars = require('pres/models/vars'), 
		HudView = require('pres/views/hud-view'), 
		SlideView = require('pres/views/slide-view'), 
		Slides = require('pres/collections/slides'),
		Slide = require('pres/models/slide'),
		ProgressBar = require('pres/views/progress-bar'),
		CameraPath = require('app/models/camera-path'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event');

    AppBase = Backbone.View.extend({

        /**
         * initialization
         */
        initialize: function () {

			this.BASE_VIEW = this.BASE_VIEW ? this.BASE_VIEW : SlideView;
            this.SLIDEVIEW_LIST = this.SLIDEVIEW_LIST ? this.SLIDEVIEW_LIST : [];

            this.first = true;

			this.slides = new Slides();
            Vars.set({'slides': this.slides});
			this.router = new AppRouter();
			Vars.set({'router': this.router});
			
			this.hud = new HudView();
						
			this.addSlides();
			this.addEventListeners();
						
            this.progressBar = new ProgressBar();
			
			CameraPath.initialize();
            Backbone.history.start();
			
            $('li').css('opacity', '0');
			$('#preloader').hide();
        },

        /* render */
        render: function () {
			var i,
				view;
			
			//console.log('render!!');
            this.progressBar.render();
        },

        handle_ROUTER: function () {
            var uri = Backbone.history.fragment === '' ? 'slide/cover' : Backbone.history.fragment,
				view,
				slide,
				pos;
						
			slide = this.slides.findWhere({url: uri});
			view = slide.get('view');
			Vars.set({'currentSlide': slide.get('id')});
			this.currentSlide = Vars.get('currentSlide');
			
			$('.slide').removeClass('visible');	
			view.$el.addClass('visible');		
			
			AppEvent.trigger('desolve');
			
			pos = slide.get('view').$el.data('pos');
			
			TweenMax.killAll();
			
			if (typeof(pos) !== 'undefined') {
				
				if (this.first === true) {
					CameraPath.delta = parseFloat(pos);
					AppEvent.trigger('resolve');
				} else {
					new TweenMax.to(CameraPath, 4, {
						delta: parseFloat(pos),
						onUpdate: function () {
							AppEvent.trigger('animate');
						},
						onComplete: function () {
							AppEvent.trigger('resolve');
						}
					});
				}
				
			} else {
				AppEvent.trigger('resolve');
			}

			this.first = false;
			this.progressBar.render();
            
        },

        handle_KEYDOWN: function (e) {
			console.log(e.keyCode);
			UserEvent.trigger('keydown', e);
		},
		
        handle_MOUSEWHEEL: function (e) {
			UserEvent.trigger('mousewheel', e.originalEvent);
		},
		
        handle_RESIZE: function (e) {
			UserEvent.trigger('resize', e);	
		},
		
        navigate: function (slideId) {
			var slide,
				url;
			
			this.stopVideos();
			$('li').css('opacity', '0');
			
			slide = this.slides.findWhere({id: slideId});
			
			if (slide) {
				url = slide.get('url');			    
				this.router.navigate(url, {trigger: true});
			}
		},
		
        next: function () {
			this.nextSlide = this.currentSlide + 1;
			this.navigate(this.nextSlide);	
		},
		
        previous: function () {			            
			this.nextSlide = this.currentSlide - 1;
			this.navigate(this.nextSlide);
		},

        trigger: function () {
            var view = this.slides.get(this.currentSlide).get('view'),
                $el = view.$el,
                video = $el.find('video'),
                list = $el.find('li');
			
			if (list.length > 0) {
                this.triggerList($el);
            } else if (video.length > 0) {
                this.triggerVideo($el);
            } else {
            	view.trigger();
            }
        },

        triggerVideo: function ($el) {
            var video = $el.find('video'),
                videoEl = video[0];

            if (videoEl.currentTime === 0) {
				video.attr('src', video.data('src'));
                videoEl.play();
            } else {
                this.next();
            }
        },

		stopVideos: function () {
			$('video').each(function () {
				$(this).attr('src', 'about:blank');
			});
		},

        triggerList: function ($el) {
            var list = $el.find('li'),
                listItem,
                i;

            for (i = 0; i < list.length; i += 1) {
                listItem = list[i];
                if ($(listItem).css('opacity') == '0') {
                    $(listItem).css('opacity', '1');
                    return;
                }
            }

            this.next();
        },

        /*
		* transition to slide complete
		*/
        resolve: function () {
			this.render();
		},

        /**
		* KEY DOWN
		*/
        keydown: function (e) {
			switch (e.keyCode) {
			case 39: //right
				AppEvent.trigger('next');
				e.preventDefault();
				break;
			case 37: //left
			case 33:
				AppEvent.trigger('previous');
				e.preventDefault();
				break;
			case 27: //esc
				AppEvent.trigger('toggle');
				e.preventDefault();
				break;
            case 32: //space
			case 34:
                AppEvent.trigger('trigger');
                e.preventDefault();
                break;
			case 190: //fullscreen
				break;
			}
		},

        mousewheel: function (e) {

        },

        /* add slides*/
        addSlides: function () {
            var instance = this,
                Base = this.BASE_VIEW;


            $('.slide').each(function (i) {
				var $this = $(this),
					slide = new Slide(),
					view, 
					j;
				
				for (j = 0; j < instance.SLIDEVIEW_LIST.length; j += 1) {
					if (instance.SLIDEVIEW_LIST[j].id && instance.SLIDEVIEW_LIST[j].id == $this.attr('id')) {
						view = new instance.SLIDEVIEW_LIST[j].view();
						break;
					} else if (instance.SLIDEVIEW_LIST[j].cl && instance.SLIDEVIEW_LIST[j].cl == $this.data('class')) {
						view = new instance.SLIDEVIEW_LIST[j].view();
                        break;
                    }
				}
				
				if (!view) {
					view = new Base();
				}
								
				view.setElement($this);

				slide.set({
					'id': i, 
					'name': $this.attr('id'), 
					'url': 'slide/' + $this.attr('id'), 
					'view': view
				});
				
				instance.slides.push(slide);
			});
        },

        /* add event listeners */
        addEventListeners: function () {
            $('body').bind('keydown', this.handle_KEYDOWN);
			$('body').bind('mousewheel', this.handle_MOUSEWHEEL);
			$(window).bind('resize', this.handle_RESIZE);

			this.router.on('route', this.handle_ROUTER, this);

			UserEvent.on('keydown', this.keydown);
			UserEvent.on('mousewheel', this.mousewheel, this);
			AppEvent.on('next', this.next, this);
			AppEvent.on('previous', this.previous, this);
			AppEvent.on('resolve', this.resolve, this);
			AppEvent.on('trigger', this.trigger, this);
            AppEvent.on('animate', this.render, this);
        }


    });

	return AppBase;
});
