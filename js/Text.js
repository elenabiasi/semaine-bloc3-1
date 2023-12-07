import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export default class Text {
  constructor(scene) {
    this.scene = scene;
  }

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
      size: 1,
      height: 1,
      // curveSegments: 12,
      // bevelEnabled: true,
      // bevelThickness: 0.1,
      // bevelSize: 0.1,
      // bevelOffset: 0,
      // bevelSegments: 5,
    });
    const material = new THREE.MeshPhongMaterial({ color: 0xb7c9e2 });
    const text = new THREE.Mesh(geometry, material);
    const boundingBox = new THREE.Box3().setFromObject(text);
    text.size = boundingBox.getSize(new THREE.Vector3());
    text.rotateX(-Math.PI / 2);
    this.scene.background = new THREE.Color(0x536878);
    text.castShadow = true;
    text.receiveShadow = true;
    this.scene.add(text);
    return text;
  }
}
