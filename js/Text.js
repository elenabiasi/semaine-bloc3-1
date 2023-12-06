import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export default class Text {
  constructor(scene) {
    this.scene = scene;
  }

  // createPoints() {
  //   // Create a curve path using SplineCurve
  //   this.curve = new THREE.SplineCurve([
  //     new THREE.Vector2(-20, 0),
  //     new THREE.Vector2(-10, 15),
  //     new THREE.Vector2(0, 0),
  //     new THREE.Vector2(10, -15),
  //     new THREE.Vector2(20, 0),
  //   ]);

  //   // Create a tube geometry along the curve
  //   const tubeGeometry = new THREE.TubeGeometry(
  //     this.curve,
  //     100,
  //     0.2,
  //     20,
  //     false
  //   );
  //   const tubeMaterial = new THREE.MeshBasicMaterial({
  //     color: 0x00ff00,
  //     wireframe: true,
  //   });
  //   const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
  //   this.scene.add(tubeMesh);
  // }

  loadFont() {
    const loader = new FontLoader();
    return new Promise((resolve, reject) => {
      loader.load("./Fredoka One_Regular.json", (font) => {
        resolve(font);
      });
    });
  }

  createText(_text, font) {
    const geometry = new TextGeometry(_text, {
      font: font,
      size: 3,
      height: 2,
      // curveSegments: 12,
      // bevelEnabled: true,
      // bevelThickness: 0.1,
      // bevelSize: 0.1,
      // bevelOffset: 0,
      // bevelSegments: 5,
    });

    // Center the text
    // geometry.computeBoundingBox();
    // const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    // geometry.translate(-textWidth / 2, 0, 0);

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const text = new THREE.Mesh(geometry, material);
    // text.material.colorWrite = false;

    text.rotateX(-Math.PI / 2);
    // text.rotateY(Math.PI * 2);
    // text.rotateZ(Math.PI * 2);

    text.castShadow = true;
    text.receiveShadow = true;
    this.scene.add(text);
    console.log(text);

    // Adjust text position and rotation along the curve
    // const textPosition = this.curve.getPointAt(0); // Adjust the parameter (0 to 1) for the desired position along the curve
    // const textRotation = this.curve.getTangentAt(0);

    // text.position.set(textPosition.x, textPosition.y, 0);
    // text.rotation.z = Math.atan2(textRotation.y, textRotation.x);

    return text;
  }
}
