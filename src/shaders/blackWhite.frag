uniform vec2 resolution;
uniform sampler2D texture;

vec3 vp (vec2 p) {
    float white = 1.0 - texture2D(texture, p).g;
    float border = 0.05;

    if (p.x <= border || p.x >= 1.0 - border || p.y <= border || p.y >= 1.0 - border) {

        white = 1.0;
    }

    return vec3(p.x * resolution.x, p.y * resolution.y, white * 2.0);
}

void main() {
    vec2 location = gl_FragCoord.xy / resolution;
    
    float ux = 1.0 / resolution.x;
    float uy = 1.0 / resolution.y; 

    vec3 v0 = vp(location);
    vec3 v1 = vp(location + vec2(ux, 0));
    vec3 v2 = vp(location + vec2(0, uy));
    vec3 v3 = vp(location + vec2(-ux, uy));
    vec3 v4 = vp(location + vec2(-ux, 0));
    vec3 v5 = vp(location + vec2(0, -uy));
    vec3 v6 = vp(location + vec2(ux, -uy));

    vec3 n0 = cross(v1 - v0, v2 - v0);
    vec3 n1 = cross(v2 - v0, v3 - v0);
    vec3 n2 = cross(v3 - v0, v4 - v0);
    vec3 n3 = cross(v4 - v0, v5 - v0);
    vec3 n4 = cross(v5 - v0, v6 - v0);
    vec3 n5 = cross(v6 - v0, v1 - v0);

    vec3 np = (normalize(n0 + n1 + n2 + n3 + n4 + n5) + vec3(1.0, 1.0, 1.0)) / 2.0;
    

    // float total = da + db;
    // vec3 color = (da+0.5/total) * vec3(1.0, 1.0, 1.0) + (db+0.5/total) * vec3(0.0, 0.0, 0.0);
    
    gl_FragColor = vec4(np, 1.0);
}
