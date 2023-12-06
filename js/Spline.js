import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Flow } from "three/examples/jsm/controls/CurveModifier.js";

export default class Spline {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    new OrbitControls(camera, renderer.domElement);

    this.somePoints = [
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(1, 0.6, 1),
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(-1, 0.2, -1),
    ];

    this.curve = new THREE.CatmullRomCurve3(somePoints);
    curve.closed = true;

    this.points = curve.getPoints(60);
    this.line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xffffaa })
    );
    scene.add(line);

    this.light = new THREE.DirectionalLight(0xc0c0c0);
    light.position.set(-8, 12, 10);
    light.intensity = 1.0;
    scene.add(light);

    this.geometry = new THREE.BoxGeometry(0.2, 0.08, 0.05);
    this.material = new THREE.MeshPhongMaterial({
      color: 0x99ffff,
      wireframe: false,
    });
    this.objectToCurve = new THREE.Mesh(geometry, material);

    this.flow = new Flow(objectToCurve);
    flow.updateCurve(0, curve);
    scene.add(flow.object3D);

    animate();
  }

  animate() {
    requestAnimationFrame(animate);
    this.flow.moveAlongCurve(0.0006);
    this.renderer.render(scene, camera);
  }
}
