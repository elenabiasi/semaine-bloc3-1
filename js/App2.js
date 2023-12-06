import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Shape from "./Shape.js";
import Light from "./Light.js";
import * as dat from "dat.gui";
import Text from "./Text.js";
// import Spline from "./Spline.js";
import Chat from "./Chat";
import AudioDetector from "./AudioDetector";
import loadObjManager from "./loadObjManager.js";

export default class App {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.assetsArray = ["asset.gltf", "mountain.gltf", "rock.gltf"];

    this.gui = new dat.GUI();

    this.chat = new Chat();
    this.chat.addEventListener("word", this.addWord.bind(this));
    this.chat.addEventListener("speechEnd", this.speechEnd.bind(this));

    // init audio detector
    // this.spline = new Spline();

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

    document.addEventListener("keydown", (e) => {
      if (e.key === "s") {
        this.initTHREE();
      }
    });
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
    this.camera.position.y = 50;
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
    this.controls.enableZoom = false;

    // Create a cube
    const shape = new Shape(this.scene);
    this.cube = shape.createCube();

    // Create a light
    // this.light = new Light(this.scene);
    this.light = new THREE.HemisphereLight(0xffffff, 0x4040ff, 1.0);

    this.scene.add(this.light);
    this.helper = new THREE.HemisphereLight(this.light, 2);
    this.light.add(this.helper);
    this.rollup = this.gui.addFolder("Hemisphere");
    this.rollup.add(this.light, "visible");
    this.rollup.add(this.light, "intensity", 0.0, 1.0);

    // this.light.createLight();
    // this.light.gui(this.gui);

    // Create a floor
    // shape.createFloor();

    const assetsManager = new loadObjManager(this.assetsArray);
    assetsManager.loadAllAssets().then((res) => {
      this.assets = res;

      const obj = this.assets[0].scene;

      obj.rotation.set(0, Math.PI / 2, 0);
      obj.position.y = -1.5;

      this.scene.add(obj);
    });

    // Create a text
    this.text = new Text(this.scene);
    this.font = await this.text.loadFont();
    console.log(this.font);
    this.text.createText("Test", this.font);

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

    // addEventListener("click", () => {
    //   //ici
    //   this.chat.call(this.chat.context);
    // });

    document.addEventListener("keydown", (e) => {
      if (e.key === "w") {
        this.chat.call(this.chat.context);
      }
    });

    //
    this.draw();
  }

  addWord(word) {
    // Create a curve path using SplineCurve
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-10, 0),
      new THREE.Vector2(-5, 5),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(5, -5),
      new THREE.Vector2(10, 0),
    ]);

    // Create a tube geometry along the curve
    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 20, false);
    const tubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      wireframe: true,
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this.scene.add(tubeMesh);

    // const mot = this.words.shift();
    // if (this.words.length <= 0) clearInterval(this.interval);

    console.log(word);
    console.log(this.font);
    const text = this.text.createText(word, this.font);

    this.allMots.push(text);
    console.log(text);
    this.allMots.forEach((mot, index) => {
      // mot.position.z = (this.allMots.length - 1 - index) * -5;
      // mot.position.x = -10;

      const t = Date.now() * 0.001;

      // mot.position.x = Math.sin(t) * 10;
      // mot.position.y = Math.cos(t) * 10;

      let incr = 0;
      incr += 0.1;

      // while (t <= 1) {
      let textPosition = curve.getPointAt(incr); // Adjust the parameter (0 to 1) for the desired position along the curve

      // const textRotation = curve.getTangentAt(0);

      // mot.position.z = (this.allMots.length - 1 - index) * -5;
      // mot.position.x = -10;

      mot.position.set(textPosition.x, textPosition.y, 0);
      // mot.position.set(textPosition.x, textPosition.y, 0);
      // mot.rotation.z = Math.atan2(textRotation.y, textRotation.x);
      // }
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

  map(num, start1, stop1, start2, stop2) {
    return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  }

  draw() {
    //this.controls.update();
    requestAnimationFrame(this.draw.bind(this));

    // this.light.update();

    this.renderer.render(this.scene, this.camera);
  }
}
