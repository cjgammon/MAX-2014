varying vec2 vUv;
varying float time;
uniform float delta;
uniform vec2 m;

void main()
{
    vUv = uv;
    
    vec3 p = position;
    if (p.x < m.x) {
        if (p.y < -m.y + (m.x - p.x) / 5.0) {
            if (p.y > -m.y - (m.x - p.x) / 5.0) {
                p.z += (m.x - p.x) / 5.0;          //just going up
                p.z += sin(p.x + delta * 2.0) * 10.0;  //sin waves
                p.z += cos(2.0 * p.x + delta) * 10.0;
            }
        }
    }
    
    //limits height
    if (p.z > 70.0) {
        p.z = 70.0;
    }
    //limits width of spline
    if (p.y < -m.y - 10.0 || p.y > -m.y + 10.0) {
        p.z = 0.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}
