import Montagne from "./Montagne.js";
import Sol from "./Sol.js";
import Rock from "./Rock.js";
import Tree from "./Tree.js";
import AllAsset from "./AllAsset.js";
import Arbres from "./Arbres.js";

import * as THREE from "three";

export default class Terrain {
  constructor(scene) {
    this.scene = scene;

    this.montagnes = [];
    this.tree = [];
    this.rock = [];
    this.allAsset = new AllAsset(this.scene);
    this.arbres = new Arbres(this.scene);

    this.group = new THREE.Object3D();
    this.active = false;
    this.scene.add(this.group);
    this.sol = new Sol(this.scene);

    this.dep = 0;

    const numShapes = 10;

    // add shapes
    for (let i = 0; i < numShapes; i++) {
      const m = new Montagne(this.scene);
      this.montagnes.push(m);

      const t = new Tree(this.scene);
      this.tree.push(t);

      const r = new Rock(this.scene);
      this.rock.push(r);
      // console.log(r);
      // this.group.add(r.scene.firstChild);
    }
    this.inc = 0;
  }

  createShapes(assets) {
    for (let i = 0; i < assets.length; i++) {
      const model = assets[i].scene;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }

    // for (let i = 0; i < this.montagnes.length; i++) {
    //   this.montagnes[i].montagne(
    //     assets[1].scene,
    //     random(-20, 20),
    //     1,
    //     random(-100, 100)
    //   );

    //   this.group.add(this.montagnes[i].obj);
    // }

    // for (let i = 0; i < this.tree.length; i++) {
    //   this.tree[i].tree(assets[3].scene, random(-20, 20), 1, random(-100, 100));
    //   this.group.add(this.tree[i].obj);
    // }

    // for (let i = 0; i < this.rock.length; i++) {
    //   this.rock[i].rock(assets[2].scene, random(-20, 20), 1, random(-100, 100));
    //   this.group.add(this.rock[i].obj);
    // }

    // this.sol.sol(assets[0].scene, 0, 0, 0);
    // this.group.add(this.sol.obj);

    this.allAsset.allAsset(assets[4].scene, 0, 0, 0);
    this.group.add(this.allAsset.obj);

    this.arbres.arbres(assets[5].scene, 0, 0, 0);
    this.group.add(this.arbres.obj);

    // console.log("GROUP", this.group);
  }

  update() {
    if (this.active) {
      this.inc -= 0.1;
      this.group.position.z = this.inc;
      // console.log("INC", this.inc);
    }
  }
}
