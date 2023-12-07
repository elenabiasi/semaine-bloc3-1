import * as THREE from "three";
import * as dat from "dat.gui";

export default class Light {
  constructor(scene) {
    this.scene = scene;
  }
  createLight() {
    // const ambientLight = new THREE.AmbientLight("#A3F6FF", 1);

    // this.scene.add(ambientLight);

    // console.log(ambientLight);

    this.hemiLight = new THREE.HemisphereLight(
      "rgb(117, 133, 155)",
      "rgb(155, 118, 107)",
      1.5
    );

    this.scene.add(this.hemiLight);

    this.directionalLight = new THREE.DirectionalLight(
      "rgb(228, 229, 231)",
      4.5
    );
    this.directionalLight.target.position.set(0, 0, 0);

    this.directionalLight.position.set(200, 300, 200);
    this.directionalLight.castShadow = true;
    this.directionalLight.distance = 500;

    this.directionalLight.shadow.camera.left = -100;
    this.directionalLight.shadow.camera.right = 100;
    this.directionalLight.shadow.camera.top = 100;
    this.directionalLight.shadow.camera.bottom = -100;
    this.directionalLight.shadow.mapSize.width = 4096;
    this.directionalLight.shadow.mapSize.height = 4096;

    this.scene.add(this.directionalLight, this.directionalLight.target);

    this.directionalLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      5
    );

    this.directionalLight.add(this.directionalLightHelper);

    //create spotlight
    this.spotLight = new THREE.SpotLight(0xffffff, 200);
    this.spotLight.position.set(3, 5, 0);
    //create Shadows
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 4096;
    this.spotLight.shadow.mapSize.height = 4096;

    // this.scene.add(this.spotLight);

    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.scene.add(this.spotLightHelper);
  }

  update() {
    this.directionalLightHelper.update();
    this.spotLightHelper.update();
  }

  gui(gui) {
    const folder = gui.addFolder("Light");
    folder.add(this.spotLight, "intensity", 0, 2000, 0.01);
    folder.add(this.directionalLight, "intensity", 1, 10, 0.01);
    folder.add(this.hemiLight, "intensity", 1, 10, 0.01);

    folder.add(this.spotLight, "angle", 0, Math.PI / 3, 0.01);
    folder.add(this.spotLight.position, "x", -10, 10, 0.001);
    folder.add(this.spotLight.position, "y", -10, 10, 0.001);
    folder.add(this.spotLight.position, "z", -10, 10, 0.001);
    //change color
    // folder.add(this.spotLight.color, "color");
    //penumbra
    //distance
    folder.add(this.spotLight, "distance", 0, 100, 0.01);

    folder.open();
  }
}
