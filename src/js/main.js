/*global require*/

require.config({
    shim: {
    },

    paths: {
	    tweenmax: 'vendor/greensock/TweenMax',
	    three: 'vendor/threejs/build/three',
        jquery: 'vendor/jquery/dist/jquery',
        underscore: 'vendor/underscore-amd/underscore',
	    backbone: 'vendor/backbone-amd/backbone',
        snap: 'vendor/snap.svg/dist/snap.svg',
        raf: 'vendor/RequestAnimationFrame'
    }
});

require(['backbone', 'three', 'app', 'underscore']);
