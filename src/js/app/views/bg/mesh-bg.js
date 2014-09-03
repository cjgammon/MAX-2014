define(function (require) {
	
	require('three');

	var BgMesh = function () {
		var Vars = require('pres/models/vars'),
			instance = this,
			colors = [0xffffff, 0xcccccc, 0xeeeeee, 0xdddddd, 0xbbbbbb, 0xaaaaaa, 0xafafaf, 0xefefef, 0xcfcfcf],
			color = new THREE.Color(),
			light,
			plane,
			geometry,
			material;
		
		instance.init = function (renderer) {
			var hex = Vars.get('slides').at(Vars.get('currentSlide')).get('view').$el.data('color');

			color.setHex(hex);
			
			instance.renderer = renderer;			
			instance.renderer.sortObjects = false;
			instance.alive = true;
			
			instance.createScene();
			
			hex = null;
		};
		
		instance.createScene = function () {
			var i,
				v,
				face,
				random;

			instance.scene = new THREE.Scene();
			instance.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 1000);
			
			light = new THREE.PointLight(color, 3, 700);
			instance.scene.add(light);
						
			geometry = new THREE.PlaneGeometry(700, 400, 10, 10);
			THREE.GeometryUtils.triangulateQuads(geometry);
			
			for (i = 0; i < geometry.faces.length; i += 1) {
				face = geometry.faces[i];
				face.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
			}
			
			for (v = 0; v < geometry.vertices.length; v += 1) {
				geometry.vertices[v].z += Math.random() * 140;
				geometry.vertices[v].y += -10 + Math.random() * 20;
				geometry.vertices[v].x += -10 + Math.random() * 20;
			}
			
			material = new THREE.MeshBasicMaterial({
				shading: THREE.FlatShading,
				color: color,
				vertexColors: THREE.FaceColors
			});
						
			plane = new THREE.Mesh(geometry, material);
			plane.position.z = -600;
			instance.scene.add(plane);
			
			light.target = plane;
			
			face = null;
			random = null;
		};
		
		instance.render = function () {
			
			if (instance.alive) {
				instance.renderer.render(instance.scene, instance.camera);
				//instance.raf = requestAnimationFrame(instance.render);
			}			
		};
		
		this.destroy = function () {
			Vars = null;
						
			//instance.raf = null;
			instance.alive = null;
			
			instance.scene.remove(plane);
			
			material.dispose();
			geometry.dispose();
			
			material = null;
			geometry = null;
			plane = null;
			color = null;
			colors = null;
			
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
	
	return BgMesh;
	
});