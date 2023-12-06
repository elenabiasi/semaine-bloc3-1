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
// import { Flow } from "three/examples/jsm/controls/CurveModifier.js";
import Montagne from "./Montagne.js";
import Sol from "./Sol.js";
import Rock from "./Rock.js";
import Tree from "./Tree.js";
import Terrain from "./Terrain.js";

export default class App {
  constructor() {
    this.loader = new THREE.FileLoader();
    this.jsonPath = "./assets/SPLINE.json";
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.assetsArray = ["asset.gltf", "mountain.gltf", "rock.gltf"];

    this.gui = new dat.GUI();

    this.chat = new Chat();
    this.chat.addEventListener("word", this.addWord.bind(this));
    this.chat.addEventListener("speechEnd", this.speechEnd.bind(this));
    this.chat.addEventListener("gpt_response", this.onResponse.bind(this));

    this.audioDetector = new AudioDetector();
    this.audioDetector.addEventListener(
      "transcriptReady",
      this.onTextReceived.bind(this)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        this.audioDetector.stopRecording();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "s") {
        this.initTHREE();
      }
    });

    // console.log("Hello test salut quentin");
  }

  // async loadCurveFromJSON(jsonpath) {
  //   let curveJSON = await loadJSON(jsonpath);
  //   let curve = createCurveFromJSON(curveJSON);
  //   let curveTubeMesh = getTubeFromCurve(curve);

  //   let curveAndMesh = {
  //     curve: curve,
  //     mesh: curveTubeMesh
  //   }

  // }

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

    // create spline
    // this.spline = new Spline(this.scene);

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
    // console.log(this.font);
    // this.text.createText("Test", this.font);

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
    //JSON Spline

    this.loader.load(this.jsonPath, (data) => {
      // Parse the JSON data
      this.jsonData = JSON.parse(data);

      // Extract control points from JSON
      const controlPoints = this.jsonData.controlPoints.map(
        (point) => new THREE.Vector3(point.x, point.y, point.z)
      );

      // Create CatmullRomCurve3 with the control points
      const curve = new THREE.CatmullRomCurve3(controlPoints);

      // Now you can use the 'curve' in your Three.js scene
      // For example, you might want to create a line geometry using the curve
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(100)
      );
      const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const splineObject = new THREE.Line(curveGeometry, curveMaterial);

      this.scene.add(curveObject);

      //--> wtf

      //   // Create a curve path using SplineCurve
      // const scale = 0.3;

      // const curve = new THREE.CatmullRomCurve3([
      //   new THREE.Vector3(144 * scale, scale, 71 * scale),
      //   new THREE.Vector3(-35 * scale, scale, 36 * scale),
      //   new THREE.Vector3(148 * scale, scale, 0 * scale),
      //   new THREE.Vector3(-22 * scale, scale, -23 * scale),
      //   new THREE.Vector3(135 * scale, scale, -44 * scale),
      //   new THREE.Vector3(3 * scale, scale, -78 * scale),

      // ]);

      // const points = curve.getPoints(50);
      // const geometry = new THREE.BufferGeometry().setFromPoints(points);
      // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // // Create the final object to add to the scene
      // const splineObject = new THREE.Line(geometry, material);

      // this.scene.add(splineObject);

      // // Create a curve using a sine function
      // const sineWaveCurve = new THREE.Curve();

      // sineWaveCurve.getPoint = function (t) {
      //   const amplitude = 1; // Adjust the amplitude of the sine wave
      //   const frequency = 1; // Adjust the frequency of the sine wave

      //   const x = t * 10; // Adjust the scale of the wave along the x-axis
      //   const y = amplitude * Math.sin(frequency * x);
      //   const z = 0;

      //   return new THREE.Vector3(x, y, z);
      // };

      // // Create a geometry from the curve
      // const curveGeometry = new THREE.BufferGeometry().setFromPoints(
      //   sineWaveCurve.getPoints(100)
      // );

      // // Create a material
      // const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // // Create the curve object
      // const curveObject = new THREE.Line(curveGeometry, curveMaterial);

      // // Rotate the curve object along the x-axis
      // curveObject.rotation.x = Math.PI / 2;

      // this.scene.add(curveObject);

      // Create a tube geometry along the curve
      // const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 20, false);
      // const tubeMaterial = new THREE.MeshPhongMaterial({
      //   color: 0x000000,
      //   wireframe: true,
      // });
      // const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
      // this.scene.add(tubeMesh);

      // const mot = this.words.shift();
      // if (this.words.length <= 0) clearInterval(this.interval);

      // console.log(word);
      // console.log(this.font);
      // // mot.position.z = (this.allMots.length - 1 - index) * -5;
      // // mot.position.x = -10;
      // const t = Date.now() * 0.0001;
      // const normalizedT = t % 1;
      // // let incr = 0.5;
      // // incr += 0.01;
      // let before = this.allMots.length - 1 - index;
      // pourcent += 0.07; //index / this.motsDeLaPhrase.length;
      // const pointOnCurve = new THREE.Vector3(); // Create a vector to store the result
      // let textPosition = curve.getPointAt(normalizedT);
      // console.log(textPosition);
      // mot.position.z = (this.allMots.length - 1 - index) * -1;

      const text = this.text.createText(word, this.font);
      const splineGeometry = splineObject.geometry;

      this.allMots.push(text);
      console.log(text);
      let pourcent = 0;
      this.allMots.forEach((mot, index) => {
        pourcent = index / this.motsDeLaPhrase.length;

        let textPosition = curve.getPointAt(pourcent);
        mot.position.set(textPosition.x, 0, textPosition.z);
      });
    });

    // mot.position.z = (this.allMots.length - 1 - index) * -5;
    // mot.position.x = -10;

    // mot.position.x = Math.sin(t) * 10;
    // mot.position.y = Math.cos(t) * 10;

    // let incr = 0;
    // incr += 0.1;

    // while (t <= 1) {
    // Adjust the parameter (0 to 1) for the desired position along the curve

    // const textRotation = curve.getTangentAt(0);

    // mot.position.z = (this.allMots.length - 1 - index) * -5;
    // mot.position.x = -10;

    // mot.position.set(textPosition.x, textPosition.y, 0);
    // mot.rotation.z = Math.atan2(textRotation.y, textRotation.x);

    // }
  }

  onResponse(data) {
    console.log("reponse", data);
    this.motsDeLaPhrase = data.split(" ");
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
