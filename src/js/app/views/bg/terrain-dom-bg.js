define(function (require) {
	var Vars = require('pres/models/vars'),
		CameraPath = require('app/models/camera-path'),
		BgView;
	
	require('three');
	require('vendor/CSS3DRenderer');
	
	BgView = function () {
		var instance = this,
			slides = [];
	
		instance.init = function (camera) {			
			instance.camera = camera;
			instance.setup();
		};
		
		instance.setup = function () {
			var slideElement,
				view,
				pos,
				pathLength,	
				point,
				i;
			
			console.log('dom setup!');
			instance._slides = Vars.get('slides');
			
			instance.renderer = new THREE.CSS3DRenderer();
			instance.renderer.setSize(window.innerWidth, window.innerHeight);
			instance.renderer.domElement.id = "css-renderer";
			document.body.appendChild(instance.renderer.domElement);
			
			instance.scene = new THREE.Scene();			
			
			for (i = 0; i < instance._slides.length; i += 1) {
				
				view = instance._slides.at(i).get('view');
								
				if (typeof(view.$el.data('pos')) !== 'undefined') {
					slideElement = new THREE.CSS3DObject(view.el);
					
					pos = view.$el.data('pos');
					CameraPath.positionElement(slideElement, pos);
					
					slideElement.scale.set(0.04, 0.04, 0.04);
					
					slides.push(slideElement);
					instance.scene.add(slideElement);
				}
			}
			
			slideElement = null;
			view = null;
			pos = null;
			pathLength = null;
			point = null;
			i = null;
		};
		
		instance.render = function () {
			CameraPath.positionCamera(instance.camera);
			instance.renderer.render(instance.scene, instance.camera);
		}
		
		instance.destroy = function () {
			
			for (i = 0; i < slides.length; i += 1) {
				instance.scene.remove(slides[i]);
				slides[i] = null;
			}
			
			slides = null;
			
			document.body.removeChild(instance.renderer.domElement);
			
			instance.scene = null;
			instance.renderer = null;
			
			instance.init = null;
			instance.setup = null;
			instance.render = null;
		};
	}

	return BgView;
});