uniform vec2 resolution;
uniform sampler2D texture;

void main() {

    vec2 vUv = gl_FragCoord.xy / resolution;
    vec2 uv = texture2D(texture, vUv).xy;
    float da = uv.r;
    float db = uv.g;

    float total = da + db + 1.0;
    vec3 color = (da+0.5/total) * vec3(1.0, 1.0, 1.0) + (db+0.5/total) * vec3(0.0, 0.0, 0.0);
    gl_FragColor = vec4(color, 1.0);
}