import {Scene, WebGLRenderer, PerspectiveCamera, Vector3, AmbientLight, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide, Vector2} from 'three'

import Fbo from './fbo'
import { debug } from 'util';

/**
* Build basic scene
*/
export default class BasicScene {
  constructor (width, height) {
    this.scene = new Scene()

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })

    this.camera = new PerspectiveCamera(70, width / height, 0.1, 1000)
    this.camera.position.set(0, 0, 60)
    this.camera.lookAt(new Vector3())

    document.getElementById('threeJSContainer').appendChild(this.renderer.domElement)

    this.onWindowResize = this.onWindowResize.bind(this)
    window.addEventListener('resize', this.onWindowResize, false)
    this.onWindowResize()

    this.light = new AmbientLight(0x404040)
    this.scene.add(this.light)

    this.start = new Fbo(require('../shaders/basic.vert'), require('../shaders/start.frag'), this.renderer, { resolution: { type: "v2", value: new Vector2(256, 256)}})
    this.start.update()
    

    let uniformA = {
      resolution: { type: "v2", value: new Vector2(256, 256) }, 
      texture: { type:"t", value: this.start.texture},
      delta: {type:"f", value: 1.0},
      feed: { type: "f", value: 0.0545},
      kill: { type: "f", value: 0.062}
    }

    this.bufferA = new Fbo(require('../shaders/basic.vert'), require('../shaders/rd.frag'), this.renderer, uniformA)
    this.bufferA.update()

    let uniformB = {
      resolution: { type: "v2", value: new Vector2(256, 256) },
      texture: { type: "t", value: this.bufferA.texture},
      delta: { type: "f",value: 1.0},
      feed: { type: "f", value: 0.0545},
      kill: { type: "f", value: 0.062}
    }

    this.bufferB = new Fbo(require('../shaders/basic.vert'), require('../shaders/rd.frag'), this.renderer, uniformB)

    this.lastOutput = this.bufferA;
    this.input = null;
    this.output = null;


    let geometry = new PlaneGeometry(25, 25, 1, 1);
    let material = new MeshBasicMaterial({ map: this.bufferA.texture, side: DoubleSide });
    this.plane = new Mesh(geometry, material);
    this.scene.add(this.plane)
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

    for (let i=0; i<20; i++) {
      this.input = this.lastOutput;
      this.output = (this.lastOutput === this.bufferA) ? this.bufferB : this.bufferA;
      this.lastOutput = this.output;

      // this.lastOutput.shader.uniforms.texture = this.input.texture

      this.output.shader.uniforms.texture.value = this.input.texture
      this.output.update()

      this.plane.material.map = this.output.texture;
    }

    
    this.renderer.render(this.scene, this.camera)
  }
}
