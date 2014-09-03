define(function (require) {
	
	require('three');

	var BgMesh = function () {
		var Vars = require('pres/models/vars'),
			instance = this,
			colors = [0xffffff, 0xcccccc, 0xeeeeee, 0xdddddd, 0xbbbbbb, 0xaaaaaa, 0xafafaf, 0xefefef, 0xcfcfcf],
			color = new THREE.Color(0x333333),
			verts = [],
			speed = 0,
			delta = 0,
			light,
			plane,
			geometry,
			material;
		
		instance.init = function (renderer) {
			
			instance.renderer = renderer;			
			instance.renderer.sortObjects = false;
			instance.alive = true;
			
			instance.createScene();			
		};
		
		instance.createScene = function () {
			var _x,
				_y,
				_z,
				i,
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
				_x = geometry.vertices[v].x + -10 + Math.random() * 20;
				_y = geometry.vertices[v].y + -10 + Math.random() * 20;
				_z = geometry.vertices[v].z + Math.random() * 140;
				geometry.vertices[v].x = _x;
				geometry.vertices[v].y = _y;
				geometry.vertices[v].z = _z;
				verts[v] = {x: _x, y: _y, z: _z, s: 50 + Math.random() * 150};
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
			
			_x = null;
			_y = null;
			_z = null;
			face = null;
			random = null;
		};
		
		instance.render = function () {
			var i,
				v;
			
			if (instance.alive) {
				speed = speed < 1 ? speed + 0.001 : 1;
				delta += speed;
				
				for (i = 0; i < geometry.vertices.length; i += 1) {
					v = geometry.vertices[i];
					v.x = verts[i].x + Math.cos(delta / verts[i].s * 5) * 10;
					v.y = verts[i].y + Math.sin(delta / verts[i].s * 8) * 10;
					v.z = verts[i].z + Math.sin(delta / verts[i].s * 9) * 10;
				}
				
				geometry.verticesNeedUpdate = true;
				geometry.elementsNeedUpdate = true;
				
				instance.renderer.render(instance.scene, instance.camera);
				instance.raf = requestAnimationFrame(instance.render);
			}
			
			v = null;			
		};
		
		this.destroy = function () {
			Vars = null;
						
			instance.raf = null;
			instance.alive = null;
			
			instance.scene.remove(plane);
			
			material.dispose();
			geometry.dispose();
			
			speed = null;
			delta = null;
			material = null;
			geometry = null;
			plane = null;
			color = null;
			colors = null;
			verts = null;
			
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