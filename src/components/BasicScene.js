import {Scene, WebGLRenderer, PerspectiveCamera, Vector3, AmbientLight, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide} from 'three'

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
    let geometry = new PlaneGeometry(10, 10, 1, 1);
    let material = new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide });
    let plane = new Mesh(geometry, material);

    this.scene.add(plane)
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
    this.renderer.render(this.scene, this.camera)
  }
}
