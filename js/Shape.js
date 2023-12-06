import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//Typeface import: https://gero3.github.io/facetype.js/

export default class Shape {
  constructor(scene) {
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.scene = scene;

    this.loader = new GLTFLoader();

    this.assets = ["./../assets/rock.gltf"];

    this.objs;
    this.espace = 4;

    //this.createCube();
  }

  getAssets() {
    new Promise((resolve) => {
      this.loader.load(
        // resource URL
        this.assets[0],
        // called when the resource is loaded
        function (gltf) {
          // this.scene.add(gltf.scene);
          resolve(gltf);
          // this.objs.traverse((o) => {
          //   this.objs.scale.set(1, 1, 1);
          // });

          // gltf.animations; // Array<THREE.AnimationClip>
          // gltf.scene; // THREE.Group
          // gltf.scenes; // Array<THREE.Group>
          // gltf.cameras; // Array<THREE.Camera>
          // gltf.asset; // Object
        }
      );
    }).then((val) => {
      console.log(val.scene.children[0]);
      const obj = val.scene.children[0];
      obj.position.z = 0;
      obj.position.x = 0;

      this.scene.add(obj);
    });
  }

  createCube() {
    this.geometry = new THREE.BoxGeometry(20, 0.2, 100);
    this.material = new THREE.MeshPhongMaterial({ color: "white" });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.scene.add(this.cube);
    // this.draw();
  }

  // createFloor() {
  //   this.geometry = new THREE.PlaneGeometry(20, 100);
  //   this.material = new THREE.MeshPhongMaterial({
  //     color: "white",
  //     side: THREE.DoubleSide,
  //   });
  //   this.plane = new THREE.Mesh(this.geometry, this.material);
  //   this.plane.receiveShadow = true;
  //   this.scene.add(this.plane);
  //   this.plane.rotation.x = Math.PI / 2;
  // }

  //   draw() {
  //     this.cube.rotation.x += 0.01;
  //     // this.mesh.rotation.y += 0.01; //   }
}
