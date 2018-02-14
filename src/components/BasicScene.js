import * as THREE from 'three'
import Fbo from './fbo'
import { debug } from 'util';
import dat from 'dat-gui'
import ReactionDiffusionCube from './ReactionDiffusionCube'
import { DoubleSide } from 'three';
import { TweenLite } from 'gsap';
/**
* Build basic scene
*/

const OrbitControls = require('three-orbit-controls')(THREE)

export default class BasicScene {
  constructor (width, height) {

    this.params = {
      kill: 0.062,
      feed: 0.0545
    }

    // this.gui = new dat.GUI()
    // this.gui.add(this.params, 'kill').min(0.04500).max(0.07).step(0.00001)
    // this.gui.add(this.params, 'feed').min(0.0100).max(0.1).step(0.0001)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x000000, -10, 230)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor({ color: 0x1a1a1a})
    this.renderer.shadowMapEnabled = true;
    // this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000)
    this.camera.position.set(0, 0, 300)
    this.camera.lookAt(new THREE.Vector3())

    this.feed = this.params.feed;
    this.kill = this.params.kill;
    document.getElementById('threeJSContainer').appendChild(this.renderer.domElement)

    this.onWindowResize = this.onWindowResize.bind(this)
    window.addEventListener('resize', this.onWindowResize, false)

    // LIGHTS
    let spotLight = new THREE.SpotLight(0xffc881);
    spotLight.position.set(0, 100, 0);

    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 1;
    spotLight.intensity = 2;
    spotLight.angle = 0.5;

    this.scene.add(spotLight)

    // REACTION DIFFUSION CUBE
    this.cube = new ReactionDiffusionCube(this.params, this.renderer)
    this.scene.add(this.cube.mesh)
    // this.controls = new OrbitControls(this.camera);


    // GROUND
    let geometryGround = new THREE.PlaneGeometry(250, 250);
    let planeMaterial = new THREE.MeshPhongMaterial({ side: DoubleSide, color: 0x1a1a1a, shininess: 0, dithering: true});
    this.plane = new THREE.Mesh(geometryGround, planeMaterial)
    this.plane.receiveShadow = true;
    this.plane.rotation.x = (90 * Math.PI) /180
    this.plane.position.y = -50

    this.scene.add(this.plane)
    // this.controls.update();
    this.onWindowResize()
  }

  add (element) {
    this.scene.add(element)
  }

  remove (element) {
    this.scene.remove(element)
  }

  onWindowResize () {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    this.camera.aspect = screenWidth / screenHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(screenWidth, screenHeight)
  }

  render (delta) {
    // this.camera.position.z +=0.5;
    this.cube.update(delta)    
    // this.controls.update();
    this.renderer.render(this.scene, this.camera)
  }
}
