uniform vec2 resolution;
uniform sampler2D texture;

void main() {
    vec2 location = gl_FragCoord.xy / resolution;
    
    float ux = 1.0 / resolution.x;
    float uy = 1.0 / resolution.y; 
    float border = 0.05;
    float white = 1.0 - texture2D(texture, location).g;
    white *= white;
    white *= white;

    float color = 1.0;

    float alpha = (clamp(white, 0.45, 0.55) - 0.45) / 0.1; 
    
    if (alpha >= 0.98 || location.x <= border || location.x >= 1.0 - border || location.y <= border || location.y >= 1.0 - border) {
        color = 0.0;
    }

    gl_FragColor = vec4(vec3(color), 1.0);
}
