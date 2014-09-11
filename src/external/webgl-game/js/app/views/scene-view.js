/*global define THREE $ TweenMax*/
define([], function (require) {
	
	var Backbone = require('backbone'),
		UserEvent = require('app/events/user-event'),
		AppEvent = require('app/events/app-event'),
		AssetList = require('app/collections/asset-list'),
		rainbowFShader = require('text!app/views/shaders/colors.fs'),
		lambertVShader = require('text!app/views/shaders/uvshader.vs'),
		trailVShader = require('text!app/views/shaders/ripple.vs'),
		trailFShader = require('text!app/views/shaders/ripple.fs'),
		BgView,
		PLANE_SIZE = 70,
		HIGH_PERFORMANCE = true;
	
	require('tweenmax');
	require('three');
	
	BgView = Backbone.View.extend({

		initialize: function () {
			this.$el = $('#ground');
			
			this.c = 0;
			this.jumping = false;
			this.jumpcount = 0;
			this.speed = {x: 0, z: 0.2};
			this.acceleration = {x: 0, y: 0, z: 0},
			this.velocity = {x: 0, y: 0, z: 0},
			this.gravity = 0.3,
			this.direction = 0;
			this._floorPanels = [];
			this._trees = [];
			this._rocks = [];
			this._cameras = [];
			this._currentCamera = 0;
			
			if (Modernizr.touch) {
				HIGH_PERFORMANCE = false;
			}
			
			UserEvent.on('resize', this.resize, this);
			UserEvent.on('keydown', this.keydown, this);

			this.addScene();
			this.addGround();
			this.addSkier();
			this.addTrees();
			this.addRocks();
			this.addRainbow();
			
			setTimeout(this.addYeti.bind(this), 2000);
		},

		addScene: function () {
			this._renderer = new THREE.WebGLRenderer({canvas: this.$el[0]});
			this._renderer.setClearColor(0xfefefe, 1);
			this._scene = new THREE.Scene();
			this._scene.fog = new THREE.Fog(0xfefefe, 0.000025, 60);

			var light = new THREE.AmbientLight(0xffffff);
			this._scene.add(light);
			
			this._light = new THREE.DirectionalLight(0xffffff);
			this._scene.add(this._light);
			
			this.resize();
		},

		addSkier: function () {

			var instance = this,
				loader,
				material,
				geometry = AssetList.at(0).get('geometry'),
				materials = AssetList.at(0).get('materials');

			for (var i = 0; i < materials.length; i += 1) {
				materials[i].morphTargets = true;
				materials[i].side = THREE.DoubleSide;
				materials[i].shading = THREE.FlatShading;
			}

			material = new THREE.MeshFaceMaterial(materials);

			instance._hero = new THREE.MorphAnimMesh(geometry, material);
			instance._hero.position.y = -0.01;
			instance._hero.position.z = 0;

			instance._hero.rotation.y = 1.55;
			instance._hero.rotation.z = -3;
			instance._scene.add(instance._hero);
		},
		
		addYeti: function () {
			var instance = this,
				loader,
				material,
				geometry = AssetList.at(1).get('geometry'),
				materials = AssetList.at(1).get('materials');
				
			for (var i = 0; i < materials.length; i += 1) {
				materials[i].morphTargets = true;
				materials[i].shading = THREE.FlatShading;
			}
			
			material = new THREE.MeshFaceMaterial(materials);
			
			instance._yeti = new THREE.MorphAnimMesh(geometry, material);
			instance._yeti.position.y = -0.01;
			instance._yeti.position.z = 0;

			instance._yeti.rotation.y = 1.55;
			instance._yeti.rotation.z = -3;
			instance._scene.add(instance._yeti);
			
		},
		
		addGround: function () {
			var geometry,
				attributes,
				material,
				mesh,
				cameraZ = this._sceneCamera.position.z,
				colorArray = [0xfcfcfc, 0xfdfdfd, 0xffffff, 0xf9f9f9, 0xfafafa],
				face, random, vertice,
				i, j, k;
			
			for (i = 0; i < 3; i += 1) {
				for (j = 0; j < 3; j += 1) {
					
					geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 100, 100);
					THREE.GeometryUtils.triangulateQuads(geometry);
					for (k = 0; k < geometry.faces.length; k += 1) {
						face = geometry.faces[k];
						random = Math.round(Math.random() * (colorArray.length - 1));
						face.color.setHex(colorArray[random]);
					}

					material = new THREE.MeshLambertMaterial({
						vertexColors: THREE.FaceColors, 
						ambient: 0xffffff,
						color: 0xcccccc,
						shading: THREE.FlatShading
					});
					
					mesh = new THREE.Mesh(geometry, material);
	            	mesh.position.set(-PLANE_SIZE + (j * PLANE_SIZE), 0, cameraZ + (i * PLANE_SIZE)); //consider camera position when adding
					mesh.rotation.x = Math.PI / 2;
	            	mesh.rotation.z = Math.PI / 2;
					this._floorPanels.push(mesh);
					this._scene.add(mesh);
				}
			}			
		},

		addTrees: function () {
			var i,
				tree,
				geometry;

			//geometry = new THREE.TetrahedronGeometry(1, 0 );
			material = new THREE.MeshLambertMaterial({ambient: 0x229134, color: 0x333333, shading: THREE.FlatShading});

			for (i = 0; i < 50; i += 1) {
				size = 2 + Math.random() * 2;
				geometry = new THREE.CylinderGeometry( size / 2, 0, size, 4, 4 ),

				tree = new THREE.Mesh(geometry, material);
				tree.position.x = -25 + Math.random() * 50;
				tree.position.z = -50 + Math.random() * 100;
				tree.position.y = -0.5;
				this._scene.add(tree);

				this._trees.push(tree);
			}
		},

		addRocks: function () {
			var i,
				rock,
				geometry;

			geometry = new THREE.OctahedronGeometry(1, 1);
			material = new THREE.MeshLambertMaterial({ambient: 0x999999, color: 0x333333, shading: THREE.FlatShading});

			for (i = 0; i < 5; i += 1) {
				rock = new THREE.Mesh(geometry, material);
				rock.position.x = -25 + Math.random() * 50;
				rock.position.z = -25 + Math.random() * 50;
				rock.position.y = 0;
				rock.rotation.set(-0.8, 0.8, 0);
				this._scene.add(rock);
				this._rocks.push(rock);
			}
		},

		addRainbow: function () {
			var i,
				geometry,
				uniforms,
				attributes;

			geometry = new THREE.CubeGeometry(1, 1, 1);

			material = new THREE.MeshLambertMaterial({ambient: 0xff0000, color: 0xcccccc, shading: THREE.FlatShading});
			this.rainbow = new THREE.Mesh(geometry, material);
			this.rainbow.rotation.x = 0.7;
			this.rainbow.position.set(-25 + Math.random() * 50, 0, 50);
			this._scene.add(this.rainbow);
		},

		render: function () {
			
			if (this._hero) {
				if (this.speed.z > 0 || this.speed.x !== 0) {
					this._hero.updateAnimation(5);
				}
				
				if (this.jumping) {
					this._hero.position.y = Math.sin(this.jumpcount / 3) * -5;
					this.jumpcount += 0.1;
					if (this._hero.position.y > 0) {
						this.jumping = false;
						this._hero.position.y = -0.1;
					}
				}
				
				this._hero.position.x += this.speed.x;
				this._sceneCamera.position.x += this.speed.x;
				this._heroCamera.position.x = this._hero.position.x;
				this._perspCamera.position.x += this.speed.x;
				this._light.position.x += this.speed.x;
				
				this._hero.position.z += this.speed.z;
				this._sceneCamera.position.z += this.speed.z;
				this._heroCamera.position.z = this._hero.position.z - 4;
				this._perspCamera.position.z += this.speed.z;
				this._light.position.z += this.speed.z;
			}
			
			if(this._yeti) {
				this.updateYeti();
			}

			if (!this.jumping) {
				this.collisionDetection();
				if (HIGH_PERFORMANCE == true) {
					this.updateStream();
				}
			}
			
			this.updatePanels();
			this.updateTrees();
			this.updateRocks();
			this.updateRainbow();
			this._renderer.render(this._scene, this._cameras[this._currentCamera]);
		},
		
		collides: function (hero, item) {
			if (hero.position.z > item.position.z - 1 &&
				hero.position.z < item.position.z + 1 &&
				hero.position.x > item.position.x - 1 &&
				hero.position.x < item.position.x + 1) 
			{
				return true;
			} else {
				return false;
			}
		},
		
		collisionDetection: function () {
			var i;
			
			if (this.collides(this._hero, this.rainbow)) {
				this.jumping = true;
				this.jumpcount = 0;
			}
			
			for (i = 0; i < this._trees.length; i += 1) {
				if (this.collides(this._hero, this._trees[i])) {
					this.crash();
				}
			}
			
			for (i = 0; i < this._rocks.length; i += 1) {
				if (this.collides(this._hero, this._rocks[i])) {
					this.crash();
				}
			}
		},
		
		crash: function () {
			this.speed.z = 0;
			this.speed.x = 0;
		},
		
		gameover: function () {
			this.destroy();
			this.initialize();
		},
		
		updateYeti: function () {
			this._yeti.updateAnimation(10);
			
			if (this._yeti.position.x > this._hero.position.x + 1) {
				this._yeti.position.x -= 0.1;
				this._yeti.rotation.y = 0.5;
			} else if (this._yeti.position.x < this._hero.position.x - 1) {
				this._yeti.position.x += 0.1;
				this._yeti.rotation.y = 2;
			} else {
				this._yeti.rotation.y = 1.55;
			}
			
			if (this._yeti.position.z < this._hero.position.z) {
				this._yeti.position.z += 0.18;
			} else if (this._yeti.rotation.y == 1.55) {
				this.gameover();
			}
		},
		
		updateStream: function () {
			var i, j, face,
				colorArray = [0xf9f9f9, 0xf3f3f3, 0xf0f0f0],
				cameraZ = this._sceneCamera.position.z,
				cameraX = this._sceneCamera.position.x;
				
			for (i = 0; i < this._floorPanels.length; i += 1) {	
				//vertices	
				for (j = 0; j < this._floorPanels[i].geometry.vertices.length; j += 1) {
					vertice = this._floorPanels[i].geometry.vertices[j];
					
					if (this._floorPanels[i].position.z + vertice.x < this._hero.position.z - 1&& 
						this._floorPanels[i].position.z + vertice.x > this._hero.position.z - 2 &&
						this._floorPanels[i].position.x + vertice.y < -this._hero.position.x + 1 &&
						this._floorPanels[i].position.x + vertice.y > -this._hero.position.x - 1 &&
						vertice.z === 0) 
					{
						vertice.z = Math.random() * 1;		
						this._floorPanels[i].geometry.verticesNeedUpdate = true;	
					}
				}
				//faces
				for (j = 0; j < this._floorPanels[i].geometry.faces.length; j += 1) {
					face = this._floorPanels[i].geometry.faces[j];
					
					if (this._floorPanels[i].position.z + face.centroid.x < this._hero.position.z - 0.5 && 
						this._floorPanels[i].position.z + face.centroid.x > this._hero.position.z - 1 &&
						this._floorPanels[i].position.x + face.centroid.y < -this._hero.position.x + 0.5 &&
						this._floorPanels[i].position.x + face.centroid.y > -this._hero.position.x - 0.5 &&
						face.color.getHex() > 16382457) 
					{
						random = Math.round(Math.random() * (colorArray.length - 1));
						face.color.setHex(colorArray[random]);
						this._floorPanels[i].geometry.colorsNeedUpdate = true;
					}
				}
			}
		}, 
		
		resetPanel: function (panel) {
			var j, 
				random,
				colorArray = [0xfcfcfc, 0xfdfdfd, 0xffffff, 0xf9f9f9, 0xfafafa];
				
			for (j = 0; j < panel.geometry.vertices.length; j += 1) {
				vertice = panel.geometry.vertices[j];
				vertice.z = 0;		
				panel.geometry.verticesNeedUpdate = true;
			}
				
			for (j = 0; j < panel.geometry.faces.length; j += 1) {
				face = panel.geometry.faces[j];
				random = Math.round(Math.random() * (colorArray.length - 1));
				face.color.setHex(colorArray[random]);
				panel.geometry.colorsNeedUpdate = true;
			}
		},
		
		updatePanels: function () {
			var i,
				cameraZ = this._sceneCamera.position.z,
				cameraX = this._sceneCamera.position.x;
						
			for (i = 0; i < this._floorPanels.length; i += 1) {						
				//moving backwards
				
				if (this._floorPanels[i].position.z < cameraZ - (PLANE_SIZE * 2)) {
					this.resetPanel(this._floorPanels[i]);
					this._floorPanels[i].position.z += (PLANE_SIZE * 3);
				}

				if (cameraX - this._floorPanels[i].position.x > PLANE_SIZE * 2) {
				//if (this._floorPanels[i].position.x > cameraX + PLANE_SIZE) {
					this.resetPanel(this._floorPanels[i]);
					this._floorPanels[i].position.x += (PLANE_SIZE * 3);
				}
				
				if (cameraX - this._floorPanels[i].position.x < -PLANE_SIZE * 2) {
				//if (this._floorPanels[i].position.x < cameraX - PLANE_SIZE) {
					this.resetPanel(this._floorPanels[i]);
					this._floorPanels[i].position.x -= (PLANE_SIZE * 3);
				}
			}
		},

		updateTrees: function () {
			var i,
				tree,
				cameraZ = this._sceneCamera.position.z,
				cameraX = this._sceneCamera.position.x;

			for (i = 0; i < this._trees.length; i += 1) {
				tree = this._trees[i];

				if (cameraZ - tree.position.z > PLANE_SIZE / 2) {
					tree.position.z += PLANE_SIZE;
					tree.position.x = -25 + Math.random() * 50;
				}
				
				if (cameraX - tree.position.x > PLANE_SIZE / 2) {
					tree.position.x += PLANE_SIZE;
				}
				
				if (cameraX - tree.position.x < -PLANE_SIZE / 2) {
					tree.position.x -= PLANE_SIZE;
				}
			}
		},

		updateRocks: function () {
			var i,
				rock,
				cameraZ = this._sceneCamera.position.z,
				cameraX = this._sceneCamera.position.x;

			for (i = 0; i < this._rocks.length; i += 1) {
				rock = this._rocks[i];

				if (cameraZ - rock.position.z > PLANE_SIZE / 2) {
					rock.position.z += PLANE_SIZE;
					rock.position.x = -25 + Math.random() * 50;
				}
				
				if (cameraX - rock.position.x > PLANE_SIZE / 2) {
					rock.position.x += PLANE_SIZE;
				}
				
				if (cameraX - rock.position.x < -PLANE_SIZE / 2) {
					rock.position.x -= PLANE_SIZE;
				}
			}
		},
		
		updateRainbow: function () {
			var cameraZ = this._sceneCamera.position.z,
				cameraX = this._sceneCamera.position.x;
			
			this.c += 0.1;
			this.rainbow.material.ambient.setRGB(Math.sin(this.c + 0) * 0.5 + 0.5, Math.sin(this.c + 2) * 0.5 + 0.5, Math.sin(this.c + 4) * 0.5 + 0.5);
			this.rainbow.geometry.colorsNeedUpdate = true;
			
			if (cameraZ - this.rainbow.position.z > PLANE_SIZE / 2) {
				this.rainbow.position.z += PLANE_SIZE;
				this.rainbow.position.x = -25 + Math.random() * 50;
			}
			
			if (cameraX - this.rainbow.position.x > PLANE_SIZE / 2) {
				this.rainbow.position.x += PLANE_SIZE;
			}
			
			if (cameraX - this.rainbow.position.x < -PLANE_SIZE / 2) {
				this.rainbow.position.x -= PLANE_SIZE;
			}
		},

		getRotation: function () {
			var rotation;

			switch(this.direction) {
				case 0:
				rotation = 1.55;
					break;
				case -1:
				rotation = 2.2;
					break;
				case -2:
				rotation = 3.0;
					break;
				case 1:
				rotation = 0.8;
					break;
				case 2:
				rotation = 0.1;
					break;
			}

			return rotation;
		},

		toggleCamera: function () {
			this._currentCamera = this._currentCamera !== this._cameras.length - 1 ? this._currentCamera + 1 : 0;
		}, 
		
		keydown: function (e) {
			var camera = this._cameras[this._currentCamera];
			
			switch (e.keyCode) {
				case 32: //space
					this.toggleCamera();
					break;
				case 37: //left
					if (camera == this._heroCamera) {
						this.direction = this.direction < 2 ? this.direction += 1 : this.direction;
					} else {
						this.direction = this.direction > -2 ? this.direction -= 1 : this.direction;
					}
					break;
				case 39: //right
					if (camera == this._heroCamera) {
						this.direction = this.direction > -2 ? this.direction -= 1 : this.direction;
					} else {
						this.direction = this.direction < 2 ? this.direction += 1 : this.direction;
					}
					break;
				case 38:
					if (camera == this._heroCamera) {
						this.direction = 0;	
					}
					break;
				case 40:
					if (camera !== this._heroCamera) {
						this.direction = 0;
					}
					break;
			}

			if (this.direction == 2 || this.direction == -2) {
				this.speed.z = 0.0;
			} else {
				this.speed.z = 0.2;
			}
			
			if (this.direction == 1) {
				this.speed.x = -0.15;
			} else if (this.direction == -1) {
				this.speed.x = 0.15;
			} else if (this.direction == 2) {
				this.speed.x = -0.2;
			} else if (this.direction == -2) {
				this.speed.x = 0.2;
			} else {
				this.speed.x = 0.0;
			}
			
			this._hero.rotation.y = this.getRotation();
		},
		
		resize: function () {
			var width = window.innerWidth,
				height = window.innerHeight,
				zoom = 60,
				ortho = true;
				
			this._renderer.setSize(width, height);
			
			this._heroCamera = new THREE.PerspectiveCamera(1000, width / height, 1, 100);
			this._heroCamera.position.y = -3;
			this._heroCamera.rotation.y = 3.14;
			
			this._perspCamera = new THREE.PerspectiveCamera(1000, width / height, 1, 100);
			this._perspCamera.rotation.x = 1;
			this._perspCamera.position.y = -10;			
			this._perspCamera.position.z = 10;
						
			this._sceneCamera = new THREE.OrthographicCamera( window.innerWidth / - zoom, window.innerWidth / zoom, window.innerHeight / zoom, window.innerHeight / - zoom, -500, 1000 );
			this._sceneCamera.rotation.z = 3.14;	
			this._sceneCamera.rotation.x = 1;
			this._sceneCamera.position.y = -10;			
			this._sceneCamera.position.z = 10;
								
			this._cameras = [this._sceneCamera, this._perspCamera, this._heroCamera];
			
			this._renderer.render(this._scene, this._cameras[this._currentCamera]);
		},
		
		destroy: function () {
			for (var i = 0; i < this._scene.children.length; i += 1) {
				this._scene.remove(this._scene.children[i]);
			}
			
			UserEvent.off('resize', this.resize);
			UserEvent.off('keydown', this.keydown);
			
			this.jumping = false;
			this.jumpcount = 0;
			this.speed = {x: 0, z: 0.2};
			this.acceleration = {x: 0, y: 0, z: 0},
			this.velocity = {x: 0, y: 0, z: 0},
			this.gravity = 0.3,
			this.direction = 0;
			this._floorPanels = [];
			this._trees = [];
			this._rocks = [];
			this._yeti = null;
		}
	});
		
	return BgView;
});
