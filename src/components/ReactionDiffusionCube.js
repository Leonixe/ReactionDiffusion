import * as THREE from 'three'

import Fbo from './fbo'
/**
* Build Reaction Diffusion Cube
*/

export default class ReactionDiffusionCube {
    constructor(renderer) {
        this.width = 512;
        this.height = 512;
        this.feed = 0.0545;
        this.kill = 0.062;
        this.ready = false;
        let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))
        this.repeat = isSafari ? 3 : 10;

        this.start = new Fbo(require('../shaders/basic.vert'), require('../shaders/start.frag'), renderer, { resolution: { type: "v2", value: new THREE.Vector2(this.width, this.height) } })
        this.start.update()

        let uniformA = {
            resolution: { type: "v2", value: new THREE.Vector2(this.width, this.height) },
            texture: { type: "t", value: this.start.texture },
            delta: { type: "f", value: 1.0 },
            feed: { type: "f", value: this.feed },
            kill: { type: "f", value: this.kill }
        }

        this.bufferA = new Fbo(require('../shaders/basic.vert'), require('../shaders/rd.frag'), renderer, uniformA)
        this.bufferA.update()

        let uniformB = {
            resolution: { type: "v2", value: new THREE.Vector2(this.width, this.height) },
            texture: { type: "t", value: this.bufferA.texture },
            delta: { type: "f", value: 1.0 },
            feed: { type: "f", value: this.feed },
            kill: { type: "f", value: this.kill }
        }

        this.bufferB = new Fbo(require('../shaders/basic.vert'), require('../shaders/rd.frag'), renderer, uniformB)
        this.blackAndWhite = new Fbo(require('../shaders/basic.vert'), require('../shaders/blackWhite.frag'), renderer, { resolution: { type: "v2", value: new THREE.Vector2(this.width, this.height) }, texture: { type: "t", value: null } })

        this.lastOutput = this.bufferA;
        this.input = null;
        this.output = null;

        this.golden = new Fbo(
            require('../shaders/basic.vert'),
            require('../shaders/golden.frag'),
            renderer,
            { resolution: { type: "v2", value: new THREE.Vector2(this.width, this.height) }, texture: { type: "t", value: null } })

        let geometry = new THREE.BoxGeometry(25, 25, 25);

        let phongMaterial = new THREE.MeshPhongMaterial({ normalMap: this.blackAndWhite.texture, color: 0x000000 })

        let urls = [
            './assets/pos-x.png',
            './assets/neg-x.png',
            './assets/pos-y.png',
            './assets/neg-y.png',
            './assets/pos-z.png',
            './assets/neg-z.png'
        ],

        cubemap = THREE.ImageUtils.loadTextureCube(urls);
        cubemap.format = THREE.RGBFormat;

        let goldenMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            normalMap: this.blackAndWhite.texture,
            alphaMap: this.golden.texture,
            color: 0xffa400,
            specular: 0x050505,
            emissive: 0xff9500,
            shininess: 100,
            envMap: cubemap
        })

        this.cube = THREE.SceneUtils.createMultiMaterialObject(geometry, [phongMaterial, goldenMaterial])//new THREE.Mesh(geometry, [phongMaterial, goldenMaterial]);
        this.cube.castShadow = true
        this.cube.rotation.y = (45 * Math.PI) / 180;
        this.cube.rotation.x = (45 * Math.PI) / 180;
    }

    get mesh () {
        return this.cube;
    }

    restartCenter () {
        this.bufferA.shader.uniforms.texture.value = this.start.texture;
        this.bufferA.update()
    }

    restartAngles () {

    }

    updateFeed (feed) {
        this.feed = feed;
    }

    updateKill (kill) {
        this.kill = kill;
    }

    update(delta) {
        if (!this.ready) return
        this.bufferA.shader.uniforms.feed.value = this.feed
        this.bufferA.shader.uniforms.kill.value = this.kill
        this.bufferB.shader.uniforms.feed.value = this.feed
        this.bufferB.shader.uniforms.kill.value = this.kill

        // this.cube.rotation.x += 0.001
        this.cube.rotation.y += 0.001
        this.cube.position.y = Math.cos(delta / 1500)


        for (let i = 0; i < this.repeat; i++) {

            this.input = this.lastOutput;
            this.output = (this.lastOutput === this.bufferA) ? this.bufferB : this.bufferA;
            this.lastOutput = this.output;


            this.output.shader.uniforms.texture.value = this.input.texture
            this.output.update()
            this.blackAndWhite.shader.uniforms.texture.value = this.output.texture
            this.blackAndWhite.update()
            this.golden.shader.uniforms.texture.value = this.output.texture
            this.golden.update()
        }

    }
}
