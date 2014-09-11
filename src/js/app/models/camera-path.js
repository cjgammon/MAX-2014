/*global define THREE*/
define(function (require) {
		
	var Backbone = require('backbone'),
		path = require('text!app/data/path.json'),
        CameraPath;
		
	require('three');
	
	CameraPath = function () {
		
		var geometry;
		
		this.delta = 0;
		
		this.initialize = function () {
			var splineVectors = [],
				i,
				vertices,
				spline;
			
			vertices = JSON.parse(path).vertices;
			path = new THREE.CurvePath();

			for (i = 0; i < vertices.length; i += 1) {
				splineVectors.push(vertices[i]);
			}

			spline = new THREE.SplineCurve3(splineVectors);
			path.add(spline);
			
			geometry = new THREE.TubeGeometry(path, vertices.length * 20, 1, 1, false, false);
		
			splineVectors = null;
			spline = null;
			path = null;
			vertices = null;
		};
		
		this.positionCamera = function (camera) {

			var t, 
				lookAt, 
				position, 
				dir, 
				normal,
				binormal,
				segments,
				pickt,
				pick,
				pickNext,
				pathLength;
			
			t = this.delta;
			
			position = geometry.path.getPointAt(t);
			dir = geometry.path.getTangentAt(t);
			normal = new THREE.Vector3();
			binormal = new THREE.Vector3();

			segments = geometry.tangents.length;
			pickt = t * segments;
			pick = Math.floor(pickt);
			pickNext = (pick + 1) % segments;

			binormal.subVectors(geometry.binormals[pickNext], geometry.binormals[pick]);
			binormal.multiplyScalar(pickt - pick).add(geometry.binormals[pick]);
			normal.copy(binormal).cross(dir).multiplyScalar(-1);
			
			camera.position = position;
			pathLength = geometry.path.getLength();
			
			//lookAt = geometry.path.getPointAt((t + 30 / pathLength) % 1);
			lookAt = geometry.path.getPointAt((t / pathLength) % 1);
			lookAt.copy(position).add(dir);

			camera.matrix.lookAt(camera.position, lookAt, normal);
			camera.rotation.setFromRotationMatrix(camera.matrix, camera.rotation.order);
		
			t = null;
			lookAt = null;
			position = null;
			dir = null;
			normal = null;
			binormal = null;
			segments = null;
			pickt = null;
			pick = null;
			pickNext = null;
			pathLength = null;
		};
		
		this.positionElement = function (element, t) {
			
			var lookAt, 
				pos, 
				dir, 
				normal,
				binormal,
				segments,
				pickt,
				pick,
				point,
				point2,
				pickNext,
				pathLength;
			
			position = geometry.path.getPointAt(t);
			dir = geometry.path.getTangentAt(t);
			normal = new THREE.Vector3();
			binormal = new THREE.Vector3();
			
			segments = geometry.tangents.length;
			pickt = t * segments;
			pick = Math.floor(pickt);
			pickNext = (pick + 1) % segments;

			binormal.subVectors(geometry.binormals[pickNext], geometry.binormals[pick]);
			binormal.multiplyScalar(pickt - pick).add(geometry.binormals[pick]);
			normal.copy(binormal).cross(dir).multiplyScalar(-1);

			element.position = position;
			pathLength = geometry.path.getLength();
			
			point = (t + 30 / pathLength) % 1;
			
			lookAt = geometry.path.getPointAt(point);
			lookAt.copy(position).add(dir);
		
			element.matrix.lookAt(element.position, lookAt, normal);
			element.rotation.setFromRotationMatrix(element.matrix, element.rotation.order);
			
			element.position = geometry.path.getPointAt(point);		
			//TODO:: need to alter positioning to be correctly cenetered
			
			position = null;
			dir = null;
			pickt = null;
			pick = null;
			pickNext = null;
			binormal = null;
			normal = null;
			pathLength = null;
			point = null;
			point2 = null;
			lookAt = null;	
		};
		
		this.length = function () {
			return geometry.path.getLength();
		};
		
	};
	
	return new CameraPath();
});
