export default class Montagne {
  constructor(scene) {
    this.scene = scene;

    //this.createCube();
  }

  montagne(res, x, y, z) {
    this.obj = res.clone();

    this.obj.castShadow = true;
    this.obj.receiveShadow = true;

    const r = random(0.2, 1);

    this.obj.rotation.set(0, Math.PI / 2, 0);
    this.obj.position.y = y;
    this.obj.position.x = x;
    this.obj.position.z = z;

    this.obj.scale.set(r, r, r);

    this.scene.add(this.obj);
  }

  // createCube() {
  //   this.geometry = new THREE.BoxGeometry(20, 0.2, 100);
  //   this.material = new THREE.MeshPhongMaterial({ color: "white" });
  //   this.cube = new THREE.Mesh(this.geometry, this.material);
  //   this.cube.castShadow = true;
  //   this.cube.receiveShadow = true;
  //   this.scene.add(this.cube);
  //   // this.draw();
  // }

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
