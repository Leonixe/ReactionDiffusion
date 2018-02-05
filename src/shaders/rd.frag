varying vec2 vUv;
uniform float utime;
uniform bool isNotInit;
uniform sampler2D uPast;
uniform sampler2D uInit;

void main() {

    float time = utime / 200.;
    vec2 uv = vUv;

    vec3 past = texture2D( uPast, uv ).rgb;

    gl_FragColor = vec4( uv, sin(time * .5) , 1. );

}