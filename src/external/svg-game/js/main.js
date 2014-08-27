require.config({
  shim: {
  },
  urlArgs: "bust=v2",

  paths: {
    hm: 'vendor/hm',
    esprima: 'vendor/esprima',
    jquery: 'vendor/jquery.min',
    d3: 'vendor/d3.v2.min',
    box2d: 'vendor/Box2dWeb-2.1.a.3.min',
    signals: 'vendor/signals.min',
    raf: 'vendor/RequestAnimationFrame',
    greensock: 'vendor/greensock/TweenMax.min'
  }
});
 
require(['app', 'raf', 'd3', 'greensock'], function(App) {
  	// use app here
	$(document).ready(function () {
		App.init();
	})
});