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
      "rgb(120, 100, 100)",
      3
    );

    this.scene.add(this.hemiLight);

    this.directionalLight = new THREE.DirectionalLight(
      "rgb(228, 229, 231)",
      2.5
    );
    this.directionalLight.target.position.set(0, 0, 0);

    this.directionalLight.position.set(200, 300, 200);
    this.directionalLight.castShadow = true;
    this.directionalLight.distance = 500;

    this.directionalLight.shadow.camera.left = -200;
    this.directionalLight.shadow.camera.right = 200;
    this.directionalLight.shadow.camera.top = 200;
    this.directionalLight.shadow.camera.bottom = -200;
    this.directionalLight.shadow.mapSize.width = 4096;
    this.directionalLight.shadow.mapSize.height = 4096;
    // this.directionalLight.shadow.camera.near = 10;
    // this.directionalLight.shadow.camera.far = -100;
    this.directionalLight.shadow.normalBias = 0.5;
    // this.directionalLight.shadow.bias = -0.0001;

    this.scene.add(this.directionalLight, this.directionalLight.target);

    this.directionalLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      5
    );

    this.directionalLight.add(this.directionalLightHelper);

    //create spotlight
    this.spotLight = new THREE.SpotLight(0xff9500, 500);
    this.spotLight.position.set(0, 10, 0);
    //create Shadows
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 4096;
    this.spotLight.shadow.mapSize.height = 4096;
    this.spotLight.shadow.normalBias = 0.5;
    this.spotLight.penumbra = 0.5;
    this.spotLight.distance = 20;

    this.scene.add(this.spotLight);

    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);

    this.spotLight2 = new THREE.SpotLight(0x9500ff, 3000);
    // this.spotLight = new THREE.SpotLight(0x0000ff, 2000);

    this.spotLight2.position.set(4, 40, -2.3);

    //create Shadows
    this.spotLight2.castShadow = true;
    this.spotLight2.shadow.mapSize.width = 3096;
    this.spotLight2.shadow.mapSize.height = 3096;
    this.spotLight2.penumbra = 0.5;
    this.spotLight2.distance = 100;

    this.scene.add(this.spotLight2);
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

  changeLightColor(color, int, int2, int3, penu) {
    //this.directionalLight.color.setHex(color);
    this.spotLight2.color.setHex(color);
    this.spotLight2.intensity = int;
    this.directionalLight.intensity = int2;
    this.spotLight.intensity = int3;
    this.spotLight.penumbra = penu;
  }
}
