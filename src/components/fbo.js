import { ShaderMaterial, Scene, OrthographicCamera, WebGLRenderTarget, RepeatWrapping, BufferGeometry, BufferAttribute, Mesh, NearestFilter, RGBAFormat, FloatType } from 'three'

class FBO {
    constructor(vert, frag, renderer, customUniforms, customFilters = {}) {        
        this.width = 512
        this.height = 512

        this.vert = vert
        this.frag = frag
        this.customUniforms = customUniforms != null ? customUniforms : {}
        this.customFilters = customFilters
        
        this.renderer = renderer

        this.init(this.renderer)
    }

    createShader() {

        this.shader = new ShaderMaterial({
            uniforms: this.customUniforms,
            vertexShader: this.vert,
            fragmentShader: this.frag,
            transparent: true
        })

    }

    get texture(){
        return this.rtt.texture;
    }

    get textureWidth() {
        return this.width;
    }

    get textureHeight() {
        return this.height;
    }

    init(renderer) {

        this.createShader()

        let gl = renderer.getContext()

        //1 we need FLOAT Textures to store positions
        //https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/extensions/oes-texture-float.html
        if (!gl.getExtension("OES_texture_float")) {
            throw new Error("float textures not supported")
        }

        //2 we need to access textures from within the vertex shader
        //https://github.com/KhronosGroup/WebGL/blob/90ceaac0c4546b1aad634a6a5c4d2dfae9f4d124/conformance-suites/1.0.0/extra/webgl-info.html
        if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0) {
            throw new Error("vertex shader cannot read textures")
        }

        //3 rtt setup
        this.scene = new Scene()
        this.orthoCamera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)

        //4 create a target texture
        let options = Object.assign({
            minFilter: NearestFilter,//important as we want to sample square pixels
            magFilter: NearestFilter,//
            format: RGBAFormat,//could be RGBAFormat
            type: FloatType,
            wrapS: RepeatWrapping,
            wrapT: RepeatWrapping//important as we need precise coordinates (not ints)
        }, this.customFilters)
        this.rtt = new WebGLRenderTarget(this.width, this.height, options)

        //5 the simulation:
        //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
        let geom = new BufferGeometry()
        geom.addAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]), 3))
        geom.addAttribute('uv', new BufferAttribute(new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]), 2))
        this.scene.add(new Mesh(geom, this.shader))
    }

    update() {
        //1 update the simulation and render the result in a target texture
        // Update uniforms
        // this.simulationShader.uniforms.utime.value += 1
        this.renderer.render(this.scene, this.orthoCamera, this.rtt, true)
    }
}
export default FBO