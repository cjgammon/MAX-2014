define(function (require) {
	
	require('three');

	var BgCover = function () {
		var instance = this;
		
		instance.init = function (renderer) {
			console.log('---init!');
			
			instance.renderer = renderer;
			instance.alive = true;
			
			instance.scene = new THREE.Scene();
			instance.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 11000);
			
		};
		
		
		instance.render = function () {
			console.log('---render!');

			if (instance.alive) {
				instance.renderer.render(instance.scene, instance.camera);
				instance.raf = requestAnimationFrame(instance.render);
			}			
		};
		
		this.destroy = function () {
			delta = null;
			
			instance.raf = null;
			instance.alive = null;
			
			instance.scene = null;
			instance.camera = null;
			
			console.log('---destroy!');
		};
	}
	
	return BgCover;
	
});