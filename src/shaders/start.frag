uniform vec2 resolution;

void main() {
    if (length((vec2(0.5, 0.5) * resolution - gl_FragCoord.xy)* vec2(0.5, 1.0)) <= 1.0) {
        gl_FragColor = vec4( 0.8, 0.8, 0.0, 1.0 );
    } else {
        gl_FragColor = vec4( 0.8, 0.0, 0.0, 1.0 );
    }
}