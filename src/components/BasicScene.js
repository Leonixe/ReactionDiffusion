import {Scene, WebGLRenderer, PerspectiveCamera, Vector3, AmbientLight, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide, Vector2} from 'three'

import Fbo from './fbo'
import { debug } from 'util';
import dat from 'dat-gui'

/**
* Build basic scene
*/
export default class BasicScene {
  constructor (width, height) {

    this.params = {
      kill: 0.018,
      feed: 0.051
    }

    this.gui = new dat.GUI()
    this.gui.add(this.params, 'kill').min(0.045).max(0.07).step(0.00001)
    this.gui.add(this.params, 'feed').min(0.01).max(0.1).step(0.0001)

    this.scene = new Scene()

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })

    this.camera = new PerspectiveCamera(70, width / height, 0.1, 1000)
    this.camera.position.set(0, 0, 40)
    this.camera.lookAt(new Vector3())
    this.feed = 0.018;
    this.kill = 0.051;
    this.width = 1024;
    this.height = 512;

    document.getElementById('threeJSContainer').appendChild(this.renderer.domElement)

    this.onWindowResize = this.onWindowResize.bind(this)
    window.addEventListener('resize', this.onWindowResize, false)
    this.onWindowResize()

    this.light = new AmbientLight(0x404040)
    this.scene.add(this.light)

    this.start = new Fbo(require('../shaders/basic.vert'), require('../shaders/start.frag'), this.renderer, { resolution: { type: "v2", value: new Vector2(this.width, this.height)}})
    this.start.update()
    

    let uniformA = {
      resolution: { type: "v2", value: new Vector2(this.width, this.height) }, 
      texture: { type:"t", value: this.start.texture},
      delta: {type:"f", value: 1.0},
      feed: { type: "f", value: this.feed},
      kill: { type: "f", value: this.kill}
    }

    this.bufferA = new Fbo(require('../shaders/basic.vert'), require('../shaders/rd.frag'), this.renderer, uniformA)
    this.bufferA.update()

    let uniformB = {
      resolution: { type: "v2", value: new Vector2(this.width, this.height) },
      texture: { type: "t", value: this.bufferA.texture},
      delta: { type: "f",value: 1.0},
      feed: { type: "f", value: this.feed},
      kill: { type: "f", value: this.kill}
    }

    this.bufferB = new Fbo(require('../shaders/basic.vert'), require('../shaders/rd.frag'), this.renderer, uniformB)
    this.blackAndWhite = new Fbo(require('../shaders/basic.vert'), require('../shaders/blackWhite.frag'), this.renderer, { resolution: { type: "v2", value: new Vector2(this.width, this.height) }, texture: { type: "t", value: null }})

    this.lastOutput = this.bufferA;
    this.input = null;
    this.output = null;


    let geometry = new PlaneGeometry(50, 25, 1, 1);
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

    this.bufferA.shader.uniforms.feed.value = this.params.feed
    this.bufferA.shader.uniforms.kill.value = this.params.kill
    this.bufferB.shader.uniforms.feed.value = this.params.feed
    this.bufferB.shader.uniforms.kill.value = this.params.kill
    

    for (let i=0; i<10; i++) {

      this.input = this.lastOutput;
      this.output = (this.lastOutput === this.bufferA) ? this.bufferB : this.bufferA;
      this.lastOutput = this.output;

      // this.lastOutput.shader.uniforms.texture = this.input.texture

      this.output.shader.uniforms.texture.value = this.input.texture
      this.output.update()
      this.blackAndWhite.shader.uniforms.texture.value = this.output.texture
      this.blackAndWhite.update()

      this.plane.material.map = this.blackAndWhite.texture;
    }

    
    this.renderer.render(this.scene, this.camera)
  }
}
