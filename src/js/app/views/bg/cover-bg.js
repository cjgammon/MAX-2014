define(function (require) {
	
	require('three');

	var BgCover = function () {
		var instance = this,
			delta = 0,
			cubes = [],
			colors = [0xff9c00, 0xff4800, 0x00a4ae],
			light,
			container;
		
		instance.init = function (renderer) {
			
			instance.renderer = renderer;			
			instance.renderer.sortObjects = false;
			instance.alive = true;
			
			instance.createScene();
		};
		
		instance.createScene = function () {
			var i,
				j,
				x = -300,
				y = 300,
				length,
				material,
				geometry,
				cube;
				
			instance.scene = new THREE.Scene();
			instance.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 1000);
			
			container = new THREE.Object3D();
			container.rotation.z = 0.3;
			container.position.z = -1001;
			instance.scene.add(container);
			
			light = new THREE.PointLight(0xffffff, 10, 1000);
			instance.scene.add(light);
			
			for (i = 0; i < 10; i += 1) {
				for (j = 0; j < 10; j += 1) {
					
					length = 50 + Math.random() * 600;
					material = new THREE.MeshLambertMaterial({
						ambient: 0xffffff, 
						color: colors[Math.floor(Math.random() * colors.length)], 
						blending: THREE.AdditiveBlending,
						opacity: 0.3, 
						transparent: true, 
						shading: THREE.FlatShading,
						side: THREE.DoubleSide
					});
					geometry = new THREE.CubeGeometry(50, 50, length);
					//geometry = new THREE.CylinderGeometry(0, 30, length, 4, 4);
					cube = new THREE.Mesh(geometry, material);
					cube.position.x = x;
					cube.position.y = y;
					cube.position.z = length / 2;
					//cube.rotation.x = Math.PI / 2;
					
					cubes.push(cube);
					container.add(cube);
					
					x += 60;
				}
				
				x = -300;
				y -= 60;
			}
			
			material = null;
			geometry = null;
			cube = null;
		};
		
		instance.render = function () {

			if (instance.alive) {
				delta += 0.01;
				
				container.rotation.y = Math.sin(delta) / 10;
				container.rotation.x = Math.cos(delta / 2) / 10;
				container.scale.z = 1 + Math.cos(delta / 10) * 0.5;
				
				instance.renderer.render(instance.scene, instance.camera);
				instance.raf = requestAnimationFrame(instance.render);
			}			
		};
		
		this.destroy = function () {
			delta = null;
			
			instance.raf = null;
			instance.alive = null;
			
			for (i = 0; i < cubes.length; i += 1) {
				container.remove(cubes[i]);
				cubes[i].material.dispose();
				cubes[i].geometry.dispose();
				cubes[i] = null;
			}
			
			cubes = null;
			colors = null;
			
			instance.scene.remove(container);
			container = null;

			instance.scene.remove(light);
			light = null;

			instance.scene = null;
			instance.camera = null;			
			
			instance.renderer.sortObjects = true;
			
			instance.init = null;
			instance.render = null;
			instance.createScene = null;			
		};
	}
	
	return BgCover;
	
});