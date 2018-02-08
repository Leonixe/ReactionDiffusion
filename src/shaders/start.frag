uniform vec2 resolution;

void main() {
    if (length(vec2(0.5, 0.5) * resolution - gl_FragCoord.xy) > 10.0) {
        gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
    } else {
        gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.0 );
    }
}