varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    gl_FragColor = vec4( uv, sin(1.0 * .5) , 1. );

}