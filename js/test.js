// https://discourse.threejs.org/t/how-to-draw-spline-in-threejs/49238

import * as THREE from "three";

// general setup, boring, skip to the next comment

var scene = new THREE.Scene();
scene.background = new THREE.Color("gainsboro");

var camera = new THREE.OrthographicCamera(
  -innerWidth / 2,
  innerWidth / 2,
  innerHeight / 2,
  -innerHeight / 2,
  -10,
  10
);
camera.position.set(0, 0, 10);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.render(scene, camera);
});

// next comment

// create a spline curve and a line to visualize it

var curve = new THREE.SplineCurve([]),
  spline = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: "black" })
  );

scene.add(spline);

// capture mouse clicks

window.addEventListener("click", onClick);

function onClick(event) {
  // click coordinates
  var x = event.clientX - innerWidth / 2,
    y = innerHeight / 2 - event.clientY;

  // draw a black circle to indicate dot position
  var point = new THREE.Mesh(
    new THREE.CircleGeometry(5),
    new THREE.MeshBasicMaterial({ color: "black" })
  );
  point.position.set(x, y, 0);
  scene.add(point);

  // add the point to the curve
  curve.points.push(new THREE.Vector2(x, y));
  curve = new THREE.SplineCurve(curve.points);
  var points = curve.getPoints(20 * curve.points.length);
  console.log(curve.points);
  // regenerate its image
  spline.geometry.dispose();
  spline.geometry = new THREE.BufferGeometry();
  spline.geometry.setFromPoints(points);

  renderer.render(scene, camera);
}
