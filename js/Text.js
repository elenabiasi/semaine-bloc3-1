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
      loader.load("./Mars Bold Display_Regular.json", (font) => {
        resolve(font);
      });
    });
  }

  createText(_text, font) {
    const geometry = new TextGeometry(_text, {
      font: font,
      size: 1,
      height: 0.5,
      // curveSegments: 12,
      // bevelEnabled: true,
      // bevelThickness: 0.1,
      // bevelSize: 0.1,
      // bevelOffset: 0,
      // bevelSegments: 5,
    });
    const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const text = new THREE.Mesh(geometry, material);
    text.rotateX(-Math.PI / 2);
    text.castShadow = true;
    text.receiveShadow = true;
    this.scene.add(text);
    return text;
  }
}
