import * as THREE from "three";
import * as dat from "dat.gui";

export default class Light {
  constructor(scene) {
    this.scene = scene;
  }
  createLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    //create spotlight
    this.spotLight = new THREE.SpotLight(0xffffff, 50);
    this.spotLight.position.set(3, 5, 0);
    //create Shadows
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 4096;
    this.spotLight.shadow.mapSize.height = 4096;

    this.scene.add(this.spotLight);

    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.scene.add(this.spotLightHelper);
  }

  update() {
    this.spotLightHelper.update();
  }

  gui(gui) {
    const folder = gui.addFolder("Light");
    folder.add(this.spotLight, "intensity", 0, 100, 0.01);
    folder.add(this.spotLight, "angle", 0, Math.PI / 3, 0.01);
    folder.add(this.spotLight.position, "x", -10, 10, 0.001);
    folder.add(this.spotLight.position, "y", -10, 10, 0.001);
    folder.add(this.spotLight.position, "z", -10, 10, 0.001);
    //change color
    // folder.add(this.spotLight.color, "color");
    //penumbra
    folder.add(this.spotLight, "penumbra", 0, 1, 0.01);
    //distance
    folder.add(this.spotLight, "distance", 0, 100, 0.01);

    folder.open();
  }
}
