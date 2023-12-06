import Montagne from "./Montagne.js";
import Sol from "./Sol.js";
import Rock from "./Rock.js";
import Tree from "./Tree.js";

export default class Terrain {
  constructor(scene) {
    this.scene = scene;

    this.montagnes = [];
    this.tree = [];
    this.rock = [];
    this.sol = [];

    const numShapes = 10;

    // Create a cube
    for (let i = 0; i < numShapes; i++) {
      const m = new Montagne(this.scene);
      this.montagnes.push(m);
      const t = new Tree(this.scene);
      this.tree.push(t);
      const r = new Rock(this.scene);
      this.rock.push(r);
      const s = new Sol(this.scene);
      this.sol.push(s);
    }
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

    for (let i = 0; i < this.montagnes.length; i++) {
      this.montagnes[i].montagne(
        assets[1].scene,
        random(-20, 20),
        1,
        random(-100, 100)
      );
    }

    for (let i = 0; i < this.tree.length; i++) {
      this.tree[i].tree(assets[3].scene, random(-20, 20), 1, random(-100, 100));
    }

    for (let i = 0; i < this.rock.length; i++) {
      this.rock[i].rock(assets[2].scene, random(-20, 20), 1, random(-100, 100));
    }

    this.sol[1].sol(assets[0].scene, 0, 0, 0);
  }
}
