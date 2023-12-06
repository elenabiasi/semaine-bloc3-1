import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class loadObjManager {
  constructor(srcArray) {
    this.srcArray = srcArray;
    this.path = "./../assets/";
    this.loader = new GLTFLoader();
  }
  loadAllAssets() {
    const pArray = [];
    for (let i = 0; i < this.srcArray.length; i++) {
      const src = `${this.path}${this.srcArray[i]}`;

      const p = this.loadAsset(src);

      pArray.push(p);
    }

    return Promise.all(pArray);
  }
  loadAsset(asset) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        asset,
        function (gltf) {
          resolve(gltf);
        },
        function (xhr) {
          console.log(xhr.loaded);
        },
        function (error) {
          reject(error);
        }
      );
    });
  }
}
