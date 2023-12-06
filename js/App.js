import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Montagne from "./Montagne.js";
import Sol from "./Sol.js";
import Rock from "./Rock.js";
import Tree from "./Tree.js";
import Terrain from "./Terrain.js";
import Light from "./light.js";
import * as dat from "dat.gui";
import Text from "./Text.js";
import Chat from "./Chat";
import AudioDetector from "./AudioDetector";
import loadObjManager from "./loadObjManager.js";
export default class App {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.assetsArray = [
      "asset.gltf",
      "mountain.gltf",
      "rock.gltf",
      "tree.gltf",
    ];

    this.dep = 0;

    this.gui = new dat.GUI();

    this.chat = new Chat();
    this.chat.addEventListener("word", this.addWord.bind(this));
    this.chat.addEventListener("speechEnd", this.speechEnd.bind(this));

    // init audio detector
    this.audioDetector = new AudioDetector();
    this.audioDetector.addEventListener(
      "transcriptReady",
      this.onTextReceived.bind(this)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        console.log("space");
        this.audioDetector.stopRecording();
      }
    });

    this.initTHREE();
  }

  async initTHREE() {
    // Create a scene
    this.scene = new THREE.Scene();
    // Create a camera
    this.camera = new THREE.PerspectiveCamera(
      49,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Set camera position
    this.camera.position.z = 20;
    this.camera.position.y = 9;
    this.camera.position.x = -20;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.gui.add(this.camera.position, "z", -2000, 2000).step(0.1);
    this.gui.add(this.camera.position, "y", -2000, 2000).step(0.1);
    this.gui.add(this.camera.position, "x", -2000, 2000).step(0.1);

    // Create a renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Set shadow
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    document.body.appendChild(this.renderer.domElement);

    //create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enable = false;
    this.controls.enableDamping = false;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;

    this.terrains = [];
    this.terrainsVisible = [];

    for (let i = 0; i < 10; i++) {
      const t = new Terrain(this.scene);
      this.terrains.push(t);
    }
    // this.montagnes = [];
    // this.tree = [];
    // this.rock = [];
    // this.sol = [];

    // const numShapes = 10;

    // // Create a cube
    // for (let i = 0; i < numShapes; i++) {
    //   const m = new Montagne(this.scene);
    //   this.montagnes.push(m);
    //   const t = new Tree(this.scene);
    //   this.tree.push(t);
    //   const r = new Rock(this.scene);
    //   this.rock.push(r);
    //   const s = new Sol(this.scene);
    //   this.sol.push(s);
    // }
    // console.log(this.shapes);

    // this.cube = shape.createCube();

    // Create a light
    this.light = new Light(this.scene);
    this.light.createLight();
    this.light.gui(this.gui);

    // Create a floor
    // shape.createFloor();

    const assetsManager = new loadObjManager(this.assetsArray);
    assetsManager.loadAllAssets().then((res) => {
      // this.all_assets = res;
      // this.addTerrain();
      this.terrains.forEach((terrain) => {
        terrain.createShapes(res);
        terrain.group.position.z = 500;
      });
      this.addTerrainFirst();
      this.addTerrain();
    });

    // Create a text
    this.text = new Text(this.scene);
    this.font = await this.text.loadFont();
    console.log(this.font);
    // this.text.createText("Hello ECAL");

    // collection de mots
    // const phrase =
    //   "Les cookies nous permettent de personnaliser le contenu et les annonces";
    // this.words = phrase.split(" ");
    // this.positionDuMot = 0;
    // this.allMots = [];
    // this.interval = setInterval(() => {
    //   this.addWord();
    // }, 2000);
    this.allMots = [];

    addEventListener("keydown", (e) => {
      if (e.key === "w") this.chat.call(this.chat.context);
    });

    //
    this.draw();
  }

  // createShapes(assets) {
  //   for (let i = 0; i < assets.length; i++) {
  //     const model = assets[i].scene;

  //     model.traverse((child) => {
  //       if (child.isMesh) {
  //         child.castShadow = true;
  //         child.receiveShadow = true;
  //       }
  //     });
  //   }

  //   for (let i = 0; i < this.montagnes.length; i++) {
  //     this.montagnes[i].montagne(
  //       assets[1].scene,
  //       random(-20, 20),
  //       1,
  //       random(-100, 100)
  //     );
  //   }

  //   for (let i = 0; i < this.tree.length; i++) {
  //     this.tree[i].tree(assets[3].scene, random(-20, 20), 1, random(-100, 100));
  //   }

  //   for (let i = 0; i < this.rock.length; i++) {
  //     this.rock[i].rock(assets[2].scene, random(-20, 20), 1, random(-100, 100));
  //   }

  //   this.sol[1].sol(assets[0].scene, 0, 0, 0);
  // }

  addTerrain() {
    // this.terrains[0].createShapes(this.all_assets);
    if (this.terrains.length > 0) {
      this.shifted = this.terrains.shift();
      this.shifted.active = true;
      this.shifted.inc = 200;
      // this.terrains.push(this.shifted);
      this.terrainsVisible.push(this.shifted);
    }
  }

  addTerrainFirst() {
    // this.terrains[0].createShapes(this.all_assets);
    if (this.terrains.length > 0) {
      this.shifted = this.terrains.shift();
      this.shifted.active = true;
      this.shifted.inc = 0;
      // this.terrains.push(this.shifted);
      this.terrainsVisible.push(this.shifted);
    }
  }

  addWord(word) {
    // const mot = this.words.shift();
    // if (this.words.length <= 0) clearInterval(this.interval);
    const text = this.text.createText(word, this.font);
    this.allMots.push(text);
    console.log(text);
    this.allMots.forEach((mot, index) => {
      mot.position.z = (this.allMots.length - 1 - index) * -1.5;
      mot.position.x = (this.allMots.length - 1 - index) * -1.5;
    });
  }

  speechEnd(data) {
    this.chat.messages.push({
      role: "assistant",
      content: data.choices[0].message.content,
    });
    this.audioDetector.startRecording();
  }

  onTextReceived(transcript) {
    this.chat.call(transcript.text);
  }

  draw() {
    //this.controls.update();

    for (let i = this.terrainsVisible.length - 1; i >= 0; i--) {
      const terrain = this.terrainsVisible[i];
      terrain.update();
      if (terrain.group.position.z <= -200) {
        // terrain.active = false;
        terrain.group.position.z = 500;
        this.terrains.push(terrain);
        this.terrainsVisible.splice(i, 1);
        this.addTerrain();
      }
    }

    // if (this.visible_terrain) {
    //   this.visible_terrain.update();
    //   if (this.visible_terrain.group.position.z <= -50) {
    //     this.addTerrain();
    //   }
    // }

    this.light.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw.bind(this));
  }
}
